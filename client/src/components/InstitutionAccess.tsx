
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Shield, 
  Crown, 
  Users, 
  Eye, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';

interface InstitutionalRole {
  id: string;
  institution: string;
  role: string;
  permissions: string[];
  status: 'active' | 'pending' | 'suspended';
  grantedAt: string;
  expiresAt?: string;
  institutionType: 'government' | 'academic' | 'corporate' | 'nonprofit' | 'legal';
}

interface InstitutionAccessProps {
  user: {
    id: string;
    email: string;
    tier: string;
  };
}

export default function InstitutionAccess({ user }: InstitutionAccessProps) {
  const { data: roles, isLoading } = useQuery({
    queryKey: [`/api/users/${user.id}/institutional-roles`],
    refetchInterval: 60000, // Refresh every minute
  });

  const institutionalRoles: InstitutionalRole[] = roles || [];

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case 'government': return Crown;
      case 'academic': return Building;
      case 'legal': return Shield;
      case 'corporate': return Building;
      case 'nonprofit': return Users;
      default: return Building;
    }
  };

  const getInstitutionColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-purple-600';
      case 'academic': return 'bg-blue-600';
      case 'legal': return 'bg-green-600';
      case 'corporate': return 'bg-orange-600';
      case 'nonprofit': return 'bg-teal-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'suspended': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return AlertTriangle;
      case 'suspended': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getRolePermissions = (role: string) => {
    const permissionMap: Record<string, string[]> = {
      'administrator': ['full_access', 'user_management', 'data_export', 'audit_logs'],
      'auditor': ['read_access', 'audit_logs', 'compliance_reports'],
      'researcher': ['read_access', 'data_export', 'analytical_tools'],
      'validator': ['verification_access', 'quality_control', 'content_moderation'],
      'observer': ['read_access', 'basic_analytics'],
    };
    
    return permissionMap[role.toLowerCase()] || ['read_access'];
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-400" />
            Institutional Access
          </div>
          <Badge className="bg-blue-600 text-white">
            {institutionalRoles.length} roles
          </Badge>
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Manage your institutional roles and permissions across organizations
        </p>
      </CardHeader>
      
      <CardContent>
        {institutionalRoles.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No institutional roles assigned</p>
            <p className="text-sm mb-4">Contact your organization administrator to request access</p>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <Plus className="w-4 h-4 mr-2" />
              Request Access
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Role Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-lg font-bold text-white">
                  {institutionalRoles.filter(role => role.status === 'active').length}
                </div>
                <div className="text-xs text-slate-400">Active Roles</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-lg font-bold text-white">
                  {new Set(institutionalRoles.map(role => role.institution)).size}
                </div>
                <div className="text-xs text-slate-400">Organizations</div>
              </div>
            </div>

            {/* Role List */}
            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
              {institutionalRoles.map((role) => {
                const InstitutionIcon = getInstitutionIcon(role.institutionType);
                const StatusIcon = getStatusIcon(role.status);
                const permissions = getRolePermissions(role.role);
                
                return (
                  <div key={role.id} className="border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${getInstitutionColor(role.institutionType)} rounded-lg flex items-center justify-center`}>
                          <InstitutionIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{role.institution}</h3>
                          <p className="text-slate-400 text-sm capitalize">{role.institutionType}</p>
                        </div>
                      </div>
                      
                      <Badge className={`${getStatusColor(role.status)} text-white`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {role.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Badge variant="outline" className="border-slate-600 text-slate-300 mb-2">
                          {role.role}
                        </Badge>
                        <div className="text-xs text-slate-500">
                          Granted: {new Date(role.grantedAt).toLocaleDateString()}
                          {role.expiresAt && (
                            <span className="ml-2">
                              Expires: {new Date(role.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Permissions */}
                    <div className="space-y-2">
                      <div className="text-xs text-slate-400">Permissions:</div>
                      <div className="flex flex-wrap gap-1">
                        {permissions.map((permission, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="border-slate-600 text-slate-400 text-xs"
                          >
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
                      <div className="flex items-center text-xs text-slate-500">
                        <Eye className="w-3 h-3 mr-1" />
                        Last accessed: 2 days ago
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white h-7 px-2">
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 h-7 px-3">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Access Management */}
            <div className="border-t border-slate-700 pt-4">
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-400">
                  Institutional access enables enhanced verification and compliance features
                </div>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Request New Role
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}