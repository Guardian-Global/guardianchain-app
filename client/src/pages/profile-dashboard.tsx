import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Award, 
  Crown, 
  Wallet, 
  FileText,
  TrendingUp,
  Clock,
  Settings
} from 'lucide-react';

export default function ProfileDashboard() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    bio: ''
  });

  // Get user from localStorage
  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : null;

  React.useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSave = () => {
    // Update localStorage with new data
    const updatedUser = { ...user, ...editData };
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    
    setIsEditing(false);
    // Force page reload to update nav
    setTimeout(() => window.location.reload(), 500);
  };

  const tierColors = {
    EXPLORER: "bg-blue-600/20 text-blue-400",
    SEEKER: "bg-green-600/20 text-green-400", 
    CREATOR: "bg-purple-600/20 text-purple-400",
    SOVEREIGN: "bg-yellow-600/20 text-yellow-400"
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Please log in to view your profile.</p>
          <Button onClick={() => window.location.href = '/'} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Dashboard</h1>
          <p className="text-slate-400">Manage your GuardianChain account and preferences</p>
        </div>

        {/* Profile Information Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-400" />
                <span>Profile Information</span>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">First Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.firstName}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter first name"
                  />
                ) : (
                  <p className="text-white text-lg">{user.firstName || 'Not set'}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">Last Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.lastName}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter last name"
                  />
                ) : (
                  <p className="text-white text-lg">{user.lastName || 'Not set'}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label className="text-slate-300">Email</Label>
              <p className="text-white text-lg">{user.email}</p>
            </div>

            <div>
              <Label className="text-slate-300">Account Tier</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={tierColors[user.tier] || "bg-slate-600/20 text-slate-400"}>
                  {user.tier}
                </Badge>
                <span className="text-slate-400 text-sm">
                  {user.tier === 'EXPLORER' && 'Basic access to core features'}
                  {user.tier === 'SEEKER' && 'Enhanced features and priority support'}
                  {user.tier === 'CREATOR' && 'Full platform access with creation tools'}
                  {user.tier === 'SOVEREIGN' && 'Ultimate access with governance rights'}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Member Since</Label>
              <p className="text-white">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => window.location.href = '/create-capsule'}>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Create Capsule</h3>
              <p className="text-slate-400 text-sm">Start preserving your truth</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-green-500/50 transition-colors cursor-pointer"
                onClick={() => window.location.href = '/eternal-staking'}>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Stake GTT</h3>
              <p className="text-slate-400 text-sm">Earn passive rewards</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => window.location.href = '/validator-dashboard'}>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Validate Truth</h3>
              <p className="text-slate-400 text-sm">Help verify content</p>
            </CardContent>
          </Card>
        </div>

        {/* Account Stats */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span>Account Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">0</div>
                <div className="text-slate-400 text-sm">Capsules Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{user.gttStakeAmount || 0}</div>
                <div className="text-slate-400 text-sm">GTT Staked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">0</div>
                <div className="text-slate-400 text-sm">Verifications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">0</div>
                <div className="text-slate-400 text-sm">Rewards Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}