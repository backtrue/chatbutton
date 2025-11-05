import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// P1: Button Configurations Table
export const configs = pgTable("configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  configJson: jsonb("config_json").notNull(), // Stores all button settings
  lang: text("lang").notNull().default('zh-TW'), // P3: Multi-language support
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertConfigSchema = createInsertSchema(configs).omit({
  id: true,
  createdAt: true,
});

export type InsertConfig = z.infer<typeof insertConfigSchema>;
export type Config = typeof configs.$inferSelect;

// Config JSON structure type
export interface ButtonConfig {
  platforms: {
    line?: string;
    messenger?: string;
    whatsapp?: string;
    instagram?: string;
    phone?: string;
    email?: string;
  };
  position: 'bottom-left' | 'bottom-right';
  color: string;
}

// Helper to validate color format (Hex or RGB)
function isValidColor(color: string): boolean {
  // Hex format: #RGB or #RRGGBB
  if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color)) {
    return true;
  }
  // RGB format: rgb(r, g, b)
  const rgbMatch = color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return parseInt(r) <= 255 && parseInt(g) <= 255 && parseInt(b) <= 255;
  }
  return false;
}

// Validation schema for ButtonConfig
export const buttonConfigSchema = z.object({
  platforms: z.object({
    line: z.string().optional(),
    messenger: z.string().optional(),
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }).refine(data => Object.values(data).some(v => v), {
    message: "至少需要選擇一個平台",
  }),
  position: z.enum(['bottom-left', 'bottom-right']),
  color: z.string().refine(isValidColor, {
    message: "請輸入有效的顏色格式（例如：#FF5733、#f57、rgb(255, 87, 51)）",
  }),
});
