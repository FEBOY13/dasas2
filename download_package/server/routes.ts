import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { fullSubmissionSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Client submission endpoint
  app.post("/api/submissions", async (req: Request, res: Response) => {
    try {
      // Validate the submission data
      const validationResult = fullSubmissionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Add IP and User-Agent information
      const submissionData = {
        ...validationResult.data,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      
      // Store the submission
      const submission = await storage.createSubmission(submissionData);
      
      // Strip the password from the response for security
      const { password, ...safeSubmission } = submission;
      
      res.status(201).json(safeSubmission);
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(500).json({ message: "Failed to create submission" });
    }
  });
  
  // Get all submissions (admin only)
  app.get("/api/submissions", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    storage.getSubmissions()
      .then(submissions => {
        res.json(submissions);
      })
      .catch(error => {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ message: "Failed to fetch submissions" });
      });
  });
  
  // Get a single submission by ID (admin only)
  app.get("/api/submissions/:id", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid submission ID" });
    }
    
    storage.getSubmission(id)
      .then(submission => {
        if (!submission) {
          return res.status(404).json({ message: "Submission not found" });
        }
        res.json(submission);
      })
      .catch(error => {
        console.error("Error fetching submission:", error);
        res.status(500).json({ message: "Failed to fetch submission" });
      });
  });
  
  // Delete a submission (admin only)
  app.delete("/api/submissions/:id", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid submission ID" });
    }
    
    storage.deleteSubmission(id)
      .then(success => {
        if (!success) {
          return res.status(404).json({ message: "Submission not found" });
        }
        res.status(200).json({ message: "Submission deleted successfully" });
      })
      .catch(error => {
        console.error("Error deleting submission:", error);
        res.status(500).json({ message: "Failed to delete submission" });
      });
  });

  const httpServer = createServer(app);
  return httpServer;
}
