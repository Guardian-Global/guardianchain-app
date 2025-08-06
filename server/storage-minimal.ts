// server/storage-minimal.ts
// Minimal storage interface for server startup

import { db } from "./db-minimal";

// Simple type definitions
export interface User {
  id: string;
  email: string;
  username?: string;
  [key: string]: any;
}

export interface Capsule {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
  [key: string]: any;
}

// Minimal storage implementation
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: any): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Capsule operations
  getCapsule(id: string): Promise<Capsule | undefined>;
  getCapsulesByUser(userId: string): Promise<Capsule[]>;
  getAllCapsules(): Promise<Capsule[]>;
  createCapsule(capsule: any): Promise<Capsule>;
  updateCapsule(id: string, capsule: Partial<Capsule>): Promise<Capsule>;
  deleteCapsule(id: string): Promise<void>;

  // Vote operations
  recordVote(vote: any): Promise<any>;
  getVotesByCapsule(capsuleId: string): Promise<any[]>;
  getUserVote(capsuleId: string, wallet: string): Promise<any>;

  // Newsletter operations
  subscribeToNewsletter(subscriber: any): Promise<any>;
  getNewsletterSubscribers(): Promise<any[]>;
}

// Mock implementation for development
class MinimalStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return undefined;
  }

  async upsertUser(user: any): Promise<User> {
    return { id: "mock-id", email: user.email, ...user };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return { id, email: "mock@example.com", ...updates };
  }

  async getCapsule(id: string): Promise<Capsule | undefined> {
    return undefined;
  }

  async getCapsulesByUser(userId: string): Promise<Capsule[]> {
    return [];
  }

  async getAllCapsules(): Promise<Capsule[]> {
    return [];
  }

  async createCapsule(capsule: any): Promise<Capsule> {
    return { id: "mock-capsule-id", user_id: capsule.user_id, ...capsule };
  }

  async updateCapsule(id: string, capsule: Partial<Capsule>): Promise<Capsule> {
    return { id, user_id: "mock-user-id", ...capsule };
  }

  async deleteCapsule(id: string): Promise<void> {
    // Mock deletion
  }

  async recordVote(vote: any): Promise<any> {
    return { id: "mock-vote-id", ...vote };
  }

  async getVotesByCapsule(capsuleId: string): Promise<any[]> {
    return [];
  }

  async getUserVote(capsuleId: string, wallet: string): Promise<any> {
    return undefined;
  }

  async subscribeToNewsletter(subscriber: any): Promise<any> {
    return { id: "mock-sub-id", ...subscriber };
  }

  async getNewsletterSubscribers(): Promise<any[]> {
    return [];
  }
}

export const storage = new MinimalStorage();
export default storage;