import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Users,
  Briefcase,
  Heart,
  Globe,
  Shield,
  ExternalLink
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest('POST', '/api/contact/submit', data);
    },
    onSuccess: () => {
      toast({
        title: 'Message Sent',
        description: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium'
      });
    },
    onError: (error) => {
      toast({
        title: 'Send Failed',
        description: 'There was an error sending your message. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  const contactCategories = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'support', label: 'Technical Support', icon: Shield },
    { value: 'partnerships', label: 'Partnerships', icon: Users },
    { value: 'investors', label: 'Investor Relations', icon: Briefcase },
    { value: 'grants', label: 'Grants & Funding', icon: Heart },
    { value: 'media', label: 'Media & Press', icon: Globe }
  ];

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@guardianchain.app',
      description: 'General inquiries and support'
    },
    {
      icon: Mail,
      label: 'Investors',
      value: 'investors@guardianchain.app',
      description: 'Investment opportunities and partnerships'
    },
    {
      icon: Mail,
      label: 'Grants',
      value: 'grants@guardianchain.app',
      description: 'Public goods and grant applications'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Business hours: Mon-Fri 9AM-6PM PST'
    }
  ];

  const officeLocations = [
    {
      city: 'San Francisco',
      address: '123 Innovation Drive, Suite 400',
      state: 'CA 94107',
      type: 'Headquarters'
    },
    {
      city: 'New York',
      address: '456 Blockchain Avenue, Floor 12',
      state: 'NY 10001',
      type: 'East Coast Office'
    },
    {
      city: 'London',
      address: '789 Fintech Square, Level 8',
      state: 'EC2M 7PY, UK',
      type: 'European Hub'
    }
  ];

  const responseTimeByCategory = {
    'general': '24 hours',
    'support': '4-8 hours',
    'partnerships': '48 hours',
    'investors': '24 hours',
    'grants': '48-72 hours',
    'media': '12 hours'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Contact GuardianChain
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get in touch with our team for support, partnerships, investment opportunities, 
            or general inquiries. We're here to help build the future of truth preservation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Inquiry Category
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {contactCategories.map((category) => (
                        <div
                          key={category.value}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.category === category.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                        >
                          <div className="flex items-center">
                            <category.icon className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {formData.category && (
                      <p className="text-xs text-gray-500 mt-2">
                        Expected response time: {responseTimeByCategory[formData.category as keyof typeof responseTimeByCategory]}
                      </p>
                    )}
                  </div>

                  {/* Subject and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By sending this message, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Direct Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <method.icon className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-blue-600">{method.value}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 2:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  For urgent matters outside business hours, please mark your inquiry as "Urgent"
                </p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Connect With Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Twitter @GuardianChain
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  LinkedIn Company
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  GitHub Repository
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Discord Community
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                  For security vulnerabilities or urgent platform issues:
                </p>
                <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100">
                  <Mail className="w-4 h-4 mr-2" />
                  security@guardianchain.app
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Locations */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {officeLocations.map((office, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{office.city}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <p>{office.address}</p>
                    <p>{office.state}</p>
                  </div>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {office.type}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">How do I report a bug or technical issue?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use the "Technical Support" category when contacting us, or email support@guardianchain.app directly. 
                  Include steps to reproduce the issue and any error messages.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Can I schedule a demo or product walkthrough?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes! Select "Partnerships" or "General Inquiry" and mention your interest in a demo. 
                  We offer personalized demonstrations for potential partners and enterprise clients.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">How can I apply for grants or funding?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose "Grants & Funding" category or email grants@guardianchain.app. 
                  We support public good initiatives and have various funding programs available.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">What if I have investment or partnership opportunities?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use "Investor Relations" or "Partnerships" categories respectively. 
                  Our business development team will respond within 24 hours to qualified inquiries.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}