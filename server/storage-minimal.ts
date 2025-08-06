// server/storage-minimal.ts
// Minimal storage implementation for comprehensive functionality

interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  tier?: string;
  onboardingCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Capsule {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content: string;
  visibility: 'private' | 'public' | 'friends' | 'unlockable';
  grief_score?: number;
  media_url?: string;
  minted?: boolean;
  mint_transaction?: string;
  ipfs_hash?: string;
  veritas_id?: string;
  created_at: string;
  updated_at: string;
}

class MinimalStorage {
  private users: Map<string, User> = new Map();
  private capsules: Map<string, Capsule> = new Map();

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add a sample user
    const sampleUser: User = {
      id: 'dev-user-123',
      email: 'dev@guardianchain.app',
      username: 'dev-user',
      displayName: 'Developer User',
      tier: 'SEEKER',
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Add sample capsules
    const sampleCapsules: Capsule[] = [
      {
        id: 'capsule-1',
        user_id: 'dev-user-123',
        title: 'My First Memory',
        description: 'A beautiful summer day',
        content: 'I remember the warmth of that perfect summer afternoon...',
        visibility: 'private',
        grief_score: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'capsule-2',
        user_id: 'dev-user-123',
        title: 'Childhood Dreams',
        description: 'Dreams of becoming an astronaut',
        content: 'When I was young, I always dreamed of touching the stars...',
        visibility: 'public',
        grief_score: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    sampleCapsules.forEach(capsule => {
      this.capsules.set(capsule.id, capsule);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const id = userData.id || `user-${Date.now()}`;
    const user: User = {
      id,
      email: userData.email || '',
      username: userData.username,
      displayName: userData.displayName,
      tier: userData.tier || 'SEEKER',
      onboardingCompleted: userData.onboardingCompleted || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Capsule methods
  async getCapsule(id: string): Promise<Capsule | null> {
    return this.capsules.get(id) || null;
  }

  async getCapsulesByUser(userId: string): Promise<Capsule[]> {
    return Array.from(this.capsules.values()).filter(
      capsule => capsule.user_id === userId
    );
  }

  async createCapsule(capsuleData: Partial<Capsule>): Promise<Capsule> {
    const id = `capsule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const capsule: Capsule = {
      id,
      user_id: capsuleData.user_id || '',
      title: capsuleData.title || '',
      description: capsuleData.description,
      content: capsuleData.content || '',
      visibility: capsuleData.visibility || 'private',
      grief_score: capsuleData.grief_score,
      media_url: capsuleData.media_url,
      minted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.capsules.set(id, capsule);
    return capsule;
  }

  async updateCapsule(id: string, updates: Partial<Capsule>): Promise<Capsule | null> {
    const capsule = this.capsules.get(id);
    if (!capsule) return null;

    const updatedCapsule = {
      ...capsule,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.capsules.set(id, updatedCapsule);
    return updatedCapsule;
  }

  async deleteCapsule(id: string): Promise<boolean> {
    return this.capsules.delete(id);
  }

  async getAllCapsules(): Promise<Capsule[]> {
    return Array.from(this.capsules.values());
  }

  async getPublicCapsules(): Promise<Capsule[]> {
    return Array.from(this.capsules.values()).filter(
      capsule => capsule.visibility === 'public'
    );
  }
}

// Export singleton instance
export const storage = new MinimalStorage();