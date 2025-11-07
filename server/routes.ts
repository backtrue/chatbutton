import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createEmailService } from "./email";
import { generateWidgetCode, generateSimplifiedEmbedCode } from "./widget";
import { generateUniversalWidgetScript } from "./widget-loader";
import { registerShopifyComplianceWebhooks } from "./shopify-webhooks";
import { insertConfigSchema, buttonConfigSchema } from "@shared/schema";
import type { ButtonConfig } from "@shared/schema";
import type { Language } from "@shared/language";

export async function registerRoutes(app: Express): Promise<Server> {
  const emailService = createEmailService();

  // POST /api/configs - Save configuration and send email
  app.post('/api/configs', async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertConfigSchema.parse(req.body);
      const configJson = validatedData.configJson as ButtonConfig;

      const preferredLanguage =
        (req as Express.Request & { preferredLanguage?: Language }).preferredLanguage ??
        validatedData.lang ??
        "zh-TW";

      // Validate button config
      buttonConfigSchema.parse(configJson);

      // Save to database first to get the config ID
      const config = await storage.createConfig({
        ...validatedData,
        lang: preferredLanguage,
      });
      
      // Construct base URL from request (force HTTPS in production)
      const protocol = req.get('x-forwarded-proto') || req.protocol;
      const baseUrl = `${protocol}://${req.get('host')}`;
      
      // Generate simplified embed code using the config ID
      const widgetCode = generateSimplifiedEmbedCode(config.id, baseUrl);
      
      // Also generate full code for email (legacy format with all details)
      const fullWidgetCode = generateWidgetCode(configJson, preferredLanguage);

      // Send email with code (using full code for completeness)
      try {
        await emailService.sendCode(
          validatedData.email,
          widgetCode,
          configJson,
          preferredLanguage
        );
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue even if email fails - user has the code in response
      }

      res.json({
        success: true,
        id: config.id,
        code: widgetCode, // Return simplified code to frontend
      });
    } catch (error: any) {
      console.error('Error creating config:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Invalid request',
      });
    }
  });

  // GET /api/configs/:id - Get configuration JSON for widget
  app.get('/api/configs/:id', async (req, res) => {
    try {
      // Enable CORS for widget embedding on external sites
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET');
      
      const config = await storage.getConfigById(req.params.id);
      
      if (!config) {
        return res.status(404).json({
          success: false,
          error: 'Configuration not found',
        });
      }

      res.json({
        success: true,
        config: config.configJson,
        lang: config.lang,
      });
    } catch (error: any) {
      console.error('Error fetching config:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // GET /widget.js - Serve universal widget script
  app.get('/widget.js', (req, res) => {
    // Enable CORS for widget embedding on external sites
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    
    const script = generateUniversalWidgetScript();
    res.type('application/javascript');
    if (req.query.v) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    }
    res.send(script);
  });

  registerShopifyComplianceWebhooks(app);

  const httpServer = createServer(app);

  return httpServer;
}
