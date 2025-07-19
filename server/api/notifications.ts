import type { Request, Response } from "express";

export async function getNotifications(req: Request, res: Response) {
  res.status(503).json({ 
    error: "Notification service not configured",
    message: "Connect your notification provider to receive notifications" 
  });
}

export async function markNotificationRead(req: Request, res: Response) {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: "Notification ID required" });
  }

  res.status(503).json({ 
    error: "Notification service not configured",
    message: "Connect your notification provider to manage notifications" 
  });
}

export async function getSystemAlerts(req: Request, res: Response) {
  res.status(503).json({ 
    error: "System alerts not configured",
    message: "Connect your monitoring provider to receive system alerts" 
  });
}