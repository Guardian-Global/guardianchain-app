import React from 'react';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';

export default function Notifications() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span style={{ color: "#7F5AF0" }}>GUARDIAN</span>
              <span style={{ color: "#2CB67D" }}>CHAIN</span>
              <span className="text-white"> Notifications</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Configure your email notifications and stay informed about your digital sovereignty journey
            </p>
          </div>
          
          <NotificationPreferences />
        </div>
      </div>
    </div>
  );
}