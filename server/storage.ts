// Reference: javascript_database blueprint
import { configs, type Config, type InsertConfig } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createConfig(insertConfig: InsertConfig): Promise<Config>;
  getConfigByEmail(email: string): Promise<Config | undefined>;
  getConfigById(id: string): Promise<Config | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createConfig(insertConfig: InsertConfig): Promise<Config> {
    const [config] = await db
      .insert(configs)
      .values(insertConfig)
      .returning();
    return config;
  }

  async getConfigByEmail(email: string): Promise<Config | undefined> {
    const [config] = await db
      .select()
      .from(configs)
      .where(eq(configs.email, email))
      .orderBy(configs.createdAt)
      .limit(1);
    return config || undefined;
  }

  async getConfigById(id: string): Promise<Config | undefined> {
    const [config] = await db
      .select()
      .from(configs)
      .where(eq(configs.id, id));
    return config || undefined;
  }
}

export const storage = new DatabaseStorage();
