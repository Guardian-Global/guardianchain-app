import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Wifi, 
  Download,
  Touch,
  Zap,
  Navigation,
  Wallet,
  Camera,
  Mic,
  Share2,
  Home,
  Search,
  Plus,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'beta' | 'coming-soon';
  implementation: string;
}

export default function MobileExperiencePage() {
  const { user } = useAuth();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);
  const [swipeDemo, setSwipeDemo] = useState(0);

  const mobileFeatures: MobileFeature[] = [
    {
      id: 'touch-navigation',
      title: 'Touch-Optimized Navigation',
      description: 'Intuitive gesture-based navigation with swipe support and touch-friendly interface elements.',
      icon: <Touch className="w-6 h-6" />,
      status: 'active',
      implementation: 'Bottom tab navigation with large touch targets and haptic feedback'
    },
    {
      id: 'mobile-capsule-creation',
      title: 'Mobile Capsule Creation',
      description: 'Streamlined mobile-first workflow for creating and uploading capsules with voice-to-text.',
      icon: <Plus className="w-6 h-6" />,
      status: 'active',
      implementation: 'Progressive form with auto-save, voice input, and camera integration'
    },
    {
      id: 'swipe-browsing',
      title: 'Swipe Vault Browsing',
      description: 'Tinder-style swipe gestures for browsing through capsule collections and discoveries.',
      icon: <Navigation className="w-6 h-6" />,
      status: 'beta',
      implementation: 'Card-based interface with left/right swipe actions and momentum scrolling'
    },
    {
      id: 'mobile-wallet',
      title: 'Mobile Wallet Integration',
      description: 'Seamless cryptocurrency wallet connections optimized for mobile devices.',
      icon: <Wallet className="w-6 h-6" />,
      status: 'active',
      implementation: 'WalletConnect integration with mobile wallet deep linking'
    },
    {
      id: 'pwa-features',
      title: 'Progressive Web App',
      description: 'Full PWA capabilities with offline support, push notifications, and home screen installation.',
      icon: <Download className="w-6 h-6" />,
      status: 'active',
      implementation: 'Service worker, app manifest, background sync, and native-like experience'
    },
    {
      id: 'offline-mode',
      title: 'Offline Capabilities',
      description: 'Continue browsing and creating content even without internet connection.',
      icon: <Wifi className="w-6 h-6" />,
      status: 'beta',
      implementation: 'Local storage caching, offline queue, and sync when online'
    }
  ];

  const mockCapsules = [
    {
      id: 1,
      title: 'Family Memories from 1985',
      author: 'Sarah Johnson',
      category: 'Personal',
      views: 1234,
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'The Truth About Climate Change',
      author: 'Dr. Michael Chen',
      category: 'Science',
      views: 5678,
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'War Stories from Vietnam',
      author: 'Robert Martinez',
      category: 'Historical',
      views: 3456,
      image: '/api/placeholder/300/200'
    }
  ];

  useEffect(() => {
    // Simulate PWA install prompt detection
    const timer = setTimeout(() => {
      setIsInstallPromptVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-advance swipe demo
    const interval = setInterval(() => {
      setSwipeDemo(prev => (prev + 1) % mockCapsules.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'beta': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'coming-soon': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const installPWA = async () => {
    // In a real implementation, this would trigger the PWA install prompt
    setIsInstallPromptVisible(false);
    alert('PWA installation would be triggered here');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header Simulation */}
      <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">GuardianChain</h1>
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Smartphone className="w-16 h-16 text-blue-500 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Mobile Experience
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Optimized mobile experience with touch navigation, swipe gestures, 
            and progressive web app capabilities for seamless mobile truth preservation.
          </p>
        </div>

        {/* PWA Install Prompt */}
        <AnimatePresence>
          {isInstallPromptVisible && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
            >
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                          Install GuardianChain
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                          Add to home screen for the full experience
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={installPWA}>
                        Install
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setIsInstallPromptVisible(false)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mobileFeatures.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedFeature === feature.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedFeature(
                  selectedFeature === feature.id ? null : feature.id
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(feature.status)} border`}>
                      {feature.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  
                  <AnimatePresence>
                    {selectedFeature === feature.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t pt-4"
                      >
                        <h4 className="font-semibold mb-2">Implementation:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.implementation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Interface Demos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Swipe Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="w-5 h-5 mr-2" />
                Swipe Browsing Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={swipeDemo}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg"
                  >
                    <div className="p-4 h-full flex flex-col">
                      <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2">
                        {mockCapsules[swipeDemo].title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        by {mockCapsules[swipeDemo].author}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <Badge>{mockCapsules[swipeDemo].category}</Badge>
                        <span className="text-sm text-gray-500">
                          {mockCapsules[swipeDemo].views.toLocaleString()} views
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-8 mt-auto">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-3 bg-red-100 rounded-full text-red-600"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </motion.button>
                        
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-3 bg-green-100 rounded-full text-green-600"
                        >
                          <Heart className="w-6 h-6" />
                        </motion.button>
                        
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-3 bg-blue-100 rounded-full text-blue-600"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {mockCapsules.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === swipeDemo ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                Swipe left to pass, right to save, or tap heart to like
              </p>
            </CardContent>
          </Card>

          {/* Mobile Creation Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Mobile Creation Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="font-semibold">Quick Capture</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Camera className="w-4 h-4 mr-2" />
                      Photo
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mic className="w-4 h-4 mr-2" />
                      Voice
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Text
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="font-semibold">Smart Enhancement</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>AI title suggestions</span>
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Auto-tagging</span>
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Quality scoring</span>
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="font-semibold">Instant Sharing</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                    <Button size="sm" variant="outline">
                      Save Draft
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Bottom Navigation Simulation */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mx-auto bg-gray-900 rounded-[2rem] p-4">
              <div className="bg-white rounded-[1.5rem] overflow-hidden">
                {/* Simulated mobile screen */}
                <div className="h-96 bg-gray-50 relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t">
                    <div className="flex items-center justify-around py-2">
                      {[
                        { icon: <Home className="w-6 h-6" />, label: 'Home', active: true },
                        { icon: <Search className="w-6 h-6" />, label: 'Discover', active: false },
                        { icon: <Plus className="w-6 h-6" />, label: 'Create', active: false },
                        { icon: <Bell className="w-6 h-6" />, label: 'Alerts', active: false },
                        { icon: <User className="w-6 h-6" />, label: 'Profile', active: false }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileTap={{ scale: 0.9 }}
                          className={`flex flex-col items-center p-2 rounded-lg ${
                            item.active ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                          }`}
                        >
                          {item.icon}
                          <span className="text-xs mt-1">{item.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 pt-8">
                    <h2 className="text-xl font-bold mb-4">Your Truth Vault</h2>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg" />
                          <div className="flex-1">
                            <h3 className="font-medium">Memory Capsule {i}</h3>
                            <p className="text-sm text-gray-600">2 hours ago</p>
                          </div>
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Mobile Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">98</div>
                <div className="text-sm text-gray-600">Performance Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1.2s</div>
                <div className="text-sm text-gray-600">Load Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">Mobile Compatibility</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}