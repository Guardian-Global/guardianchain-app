import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Shield, 
  Phone, 
  Users, 
  Gavel, 
  HeadphonesIcon,
  AlertTriangle,
  Lock,
  Building
} from 'lucide-react';

export default function ContactInfo() {
  const contacts = {
    emergency: {
      title: 'Emergency Security Contact',
      email: 'commander.guardian@protonmail.com',
      description: 'Direct encrypted contact to founder for security emergencies',
      icon: AlertTriangle,
      color: 'bg-red-600'
    },
    support: {
      title: 'General Support',
      email: 'support@guardianchain.app',
      description: 'Technical support and general inquiries',
      icon: HeadphonesIcon,
      color: 'bg-blue-600'
    },
    security: {
      title: 'Security Issues',
      email: 'security@guardianchain.app',
      description: 'Report security vulnerabilities and incidents',
      icon: Shield,
      color: 'bg-purple-600'
    },
    compliance: {
      title: 'Compliance & Legal',
      email: 'compliance@guardianchain.app',
      description: 'Regulatory compliance and legal matters',
      icon: Gavel,
      color: 'bg-amber-600'
    },
    business: {
      title: 'Business Partnerships',
      email: 'partnerships@guardianchain.app',
      description: 'Enterprise partnerships and integrations',
      icon: Building,
      color: 'bg-green-600'
    }
  };

  const handleContactClick = (email: string, subject?: string) => {
    const mailtoLink = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          🛡️ GUARDIANCHAIN Contact Information
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Secure, direct communication channels for all your needs. Our founder maintains complete privacy 
          through ProtonMail encryption while ensuring maximum accessibility for legitimate business needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(contacts).map(([key, contact]) => {
          const IconComponent = contact.icon;
          
          return (
            <Card key={key} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${contact.color}`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span>{contact.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400 text-sm">{contact.description}</p>
                
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-mono">{contact.email}</span>
                </div>
                
                <Button 
                  onClick={() => handleContactClick(contact.email, `GUARDIANCHAIN: ${contact.title} Inquiry`)}
                  className="w-full"
                  variant="outline"
                >
                  Send Email
                </Button>
                
                {key === 'emergency' && (
                  <Badge className="w-full justify-center bg-red-500 text-white">
                    <Lock className="w-3 h-3 mr-1" />
                    ProtonMail Encrypted
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Master Admin Card */}
      <Card className="bg-gradient-to-r from-purple-900 to-pink-900 border-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-purple-600">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl">Master Admin Direct Contact</h3>
                <p className="text-purple-200 text-sm">Founder & Security Administrator</p>
              </div>
            </div>
            <Badge className="bg-purple-500 text-white">
              Sovereign Access
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-purple-100">
            Direct encrypted communication with GUARDIANCHAIN founder for:
          </p>
          
          <ul className="space-y-2 text-purple-200">
            <li className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Security emergencies and vulnerabilities</span>
            </li>
            <li className="flex items-center space-x-2">
              <Gavel className="w-4 h-4" />
              <span>Legal and compliance escalations</span>
            </li>
            <li className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>High-value enterprise partnerships</span>
            </li>
            <li className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical platform incidents</span>
            </li>
          </ul>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => handleContactClick('commander.guardian@protonmail.com', 'URGENT: Security Emergency')}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency Contact
            </Button>
            
            <Button 
              onClick={() => handleContactClick('commander.guardian@protonmail.com', 'GUARDIANCHAIN: Business Inquiry')}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Business Contact
            </Button>
          </div>
          
          <div className="bg-purple-800/50 p-3 rounded-lg">
            <p className="text-purple-100 text-sm">
              <Lock className="w-4 h-4 inline mr-1" />
              All communications are encrypted with ProtonMail end-to-end encryption. 
              Response time: Emergency (30 minutes), Business (24 hours).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Communication Security */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2 text-green-400" />
            Communication Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-white mb-2">Security Features</h4>
              <ul className="space-y-1 text-slate-400 text-sm">
                <li>• ProtonMail end-to-end encryption</li>
                <li>• Secure SMTP with TLS 1.3</li>
                <li>• Zero-knowledge architecture</li>
                <li>• Automatic PGP encryption</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Response Times</h4>
              <ul className="space-y-1 text-slate-400 text-sm">
                <li>• Emergency: 30 minutes</li>
                <li>• Security: 2 hours</li>
                <li>• Business: 24 hours</li>
                <li>• Support: 48 hours</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
            <p className="text-green-200 text-sm">
              All GUARDIANCHAIN communications are secured with military-grade encryption. 
              Your privacy and security are our highest priorities.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}