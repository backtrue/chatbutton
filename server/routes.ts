import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createEmailService } from "./email";
import { generateWidgetCode } from "./widget";
import { insertConfigSchema, buttonConfigSchema } from "@shared/schema";
import type { ButtonConfig } from "@shared/schema";
import type { Language } from "../client/src/lib/i18n";

export async function registerRoutes(app: Express): Promise<Server> {
  const emailService = createEmailService();

  // POST /api/configs - Save configuration and send email
  app.post('/api/configs', async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertConfigSchema.parse(req.body);
      const configJson = validatedData.configJson as ButtonConfig;

      // Validate button config
      buttonConfigSchema.parse(configJson);

      // Generate widget code
      const widgetCode = generateWidgetCode(configJson, validatedData.lang as Language);

      // Save to database
      const config = await storage.createConfig(validatedData);

      // Send email with code
      try {
        await emailService.sendCode(
          validatedData.email,
          widgetCode,
          configJson,
          validatedData.lang || 'zh-TW'
        );
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue even if email fails - user has the code in response
      }

      res.json({
        success: true,
        id: config.id,
        code: widgetCode,
      });
    } catch (error: any) {
      console.error('Error creating config:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Invalid request',
      });
    }
  });

  // GET /api/widget/:id - Get widget code for a specific config (P2 feature)
  app.get('/api/widget/:id', async (req, res) => {
    try {
      const config = await storage.getConfigById(req.params.id);
      
      if (!config) {
        return res.status(404).json({
          success: false,
          error: 'Configuration not found',
        });
      }

      const widgetCode = generateWidgetCode(
        config.configJson as ButtonConfig,
        config.lang as Language
      );

      res.type('application/javascript').send(widgetCode.replace(/<\/?script>/g, ''));
    } catch (error: any) {
      console.error('Error fetching widget:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
