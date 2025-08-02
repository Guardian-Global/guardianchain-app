import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

export function assetMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Only handle asset requests
  if (!req.path.startsWith("/assets/")) {
    return next();
  }

  const assetPath = path.join(process.cwd(), "public", req.path);

  // Check if file exists
  if (!fs.existsSync(assetPath)) {
    return next();
  }

  // Set proper MIME types
  const ext = path.extname(assetPath).toLowerCase();
  switch (ext) {
    case ".png":
      res.setHeader("Content-Type", "image/png");
      break;
    case ".jpg":
    case ".jpeg":
      res.setHeader("Content-Type", "image/jpeg");
      break;
    case ".mp4":
      res.setHeader("Content-Type", "video/mp4");
      break;
    case ".webm":
      res.setHeader("Content-Type", "video/webm");
      break;
    case ".svg":
      res.setHeader("Content-Type", "image/svg+xml");
      break;
    default:
      res.setHeader("Content-Type", "application/octet-stream");
  }

  // Set cache headers for better performance
  res.setHeader("Cache-Control", "public, max-age=31536000");

  // Send the file
  res.sendFile(assetPath);
}
