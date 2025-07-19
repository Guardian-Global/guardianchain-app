import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandedText } from "@/components/BrandEnforcement";
import EmailPreferences from '@/components/EmailPreferences';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';
import { Mail, Settings, Shield } from "lucide-react";

export default function Notifications() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <BrandedText />
              <span className="text-white"> Notification Center</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Manage your email preferences and notification settings for optimal digital sovereignty experience
            </p>
          </div>
          
          <Tabs defaultValue="email" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>In-App Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Security Alerts</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <EmailPreferences />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationPreferences />
            </TabsContent>

            <TabsContent value="security">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Security Alert Settings</h3>
                <p className="text-slate-400 mb-6">
                  Security notifications are always enabled and cannot be disabled for your protection.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                    <h4 className="font-semibold text-red-400 mb-2">Critical Alerts</h4>
                    <p className="text-sm text-slate-300">
                      Login attempts, wallet connections, and emergency protocol updates
                    </p>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-400 mb-2">Compliance Notices</h4>
                    <p className="text-sm text-slate-300">
                      Legal updates, privacy policy changes, and regulatory notifications
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}