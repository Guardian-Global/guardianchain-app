import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  MessageSquare,
  Clock,
  Calendar as CalendarIcon,
  Send,
  Heart,
  Gift,
  Star,
  Lock,
  TrendingUp,
  Baby,
  GraduationCap,
  CircleDot,
  Cake,
  Users,
  Timer,
  Infinity,
  Shield,
  DollarSign,
} from 'lucide-react';

export default function TimeMessages() {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [messageType, setMessageType] = useState('birthday');
  const [investment, setInvestment] = useState(15);

  const messageTemplates = [
    {
      id: 'birthday',
      name: 'Birthday Wishes',
      icon: Cake,
      description: 'Send birthday messages years into the future',
      cost: '$15-50',
      potential: 'Variable*',
      examples: ['16th Birthday', '18th Birthday', '21st Birthday', '50th Birthday'],
      timeframes: ['16 years', '25 years', '50 years', '100 years']
    },
    {
      id: 'graduation',
      name: 'Graduation Advice',
      icon: GraduationCap,
      description: 'Wisdom for future educational milestones',
      cost: '$25-75',
      potential: 'Variable*',
      examples: ['High School Graduation', 'College Graduation', 'PhD Defense', 'Career Achievement'],
      timeframes: ['10 years', '18 years', '25 years', '30 years']
    },
    {
      id: 'wedding',
      name: 'Wedding Blessings',
      icon: CircleDot,
      description: 'Love messages for future wedding days',
      cost: '$50-150',
      potential: 'Variable*',
      examples: ['Engagement Day', 'Wedding Day', 'Anniversary', 'Renewal Vows'],
      timeframes: ['20 years', '30 years', '50 years', '75 years']
    },
    {
      id: 'newborn',
      name: 'Welcome Baby',
      icon: Baby,
      description: 'First messages to future children',
      cost: '$35-100',
      potential: 'Variable*',
      examples: ['Birth Day', 'First Steps', 'First Words', 'First Day of School'],
      timeframes: ['1 year', '5 years', '18 years', '25 years']
    },
    {
      id: 'wisdom',
      name: 'Life Wisdom',
      icon: Star,
      description: 'Share life lessons for the future',
      cost: '$100-300',
      potential: 'Variable*',
      examples: ['Life Advice', 'Family History', 'Business Wisdom', 'Spiritual Guidance'],
      timeframes: ['50 years', '100 years', '200 years', '500 years']
    },
    {
      id: 'apology',
      name: 'Future Reconciliation',
      icon: Heart,
      description: 'Healing messages for future understanding',
      cost: '$20-60',
      potential: 'Variable*',
      examples: ['Sorry Message', 'Explanation', 'Forgiveness', 'Understanding'],
      timeframes: ['5 years', '10 years', '25 years', '50 years']
    },
  ];

  const realisticExamples = [
    {
      message: "Happy Sweet 16, my darling granddaughter! I'm writing this when you're just 1 year old. I invested $15 in this message. Remember: the real value is in our family's love and memories. ❤️",
      deliveryYear: 2040,
      currentValue: '$15',
      estimatedValue: '$24',
      recipient: 'Granddaughter Emma',
      yearsLocked: 15,
      type: 'Birthday'
    },
    {
      message: "Congratulations on your college graduation! I'm your great-grandfather, writing this in 2025. This $25 message capsule is a small token of our pride in you. Work hard, dream big, and remember that education is the most valuable investment. Your family is proud of you!",
      deliveryYear: 2047,
      currentValue: '$25',
      estimatedValue: '$50',
      recipient: 'Great-Grandson Alex',
      yearsLocked: 22,
      type: 'Graduation'
    },
    {
      message: "My dearest future daughter-in-law, welcome to our family! I'm writing this before my son even knows you exist. This $50 message is a small contribution to your wedding day. May your love grow steadily and beautifully over time. With all my love, Mom",
      deliveryYear: 2055,
      currentValue: '$50',
      estimatedValue: '$135',
      recipient: 'Future Daughter-in-Law',
      yearsLocked: 30,
      type: 'Wedding'
    },
  ];

  // IMPORTANT: These are illustrative examples only, not financial advice or guarantees
  const calculateEstimatedValue = (initial: number, years: number) => {
    // Conservative estimation based on historical market averages (3-4%)
    const conservativeRate = 0.035; // 3.5% annual growth
    const estimated = initial * Math.pow(1 + conservativeRate, years);
    return Math.min(estimated, initial * 10); // Cap at 10x to prevent unrealistic projections
  };

  const getYearsUntilDelivery = () => {
    if (!deliveryDate) return 0;
    const now = new Date();
    const years = Math.abs(deliveryDate.getFullYear() - now.getFullYear());
    return years;
  };

  const selectedTemplate = messageTemplates.find(t => t.id === messageType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/10 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Time-Lock Messages
            <Badge className="ml-4 bg-indigo-600/20 text-indigo-400">VIRAL POTENTIAL</Badge>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            Send messages years into the future that grow in value while they wait. 
            Turn a $15 birthday wish into a $50,000 gift that arrives exactly when needed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Message Creator */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-indigo-400" />
                  <span>Create Time-Lock Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Message Type Selection */}
                <div>
                  <label className="text-slate-300 text-sm mb-3 block">Message Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {messageTemplates.slice(0, 6).map((template) => {
                      const Icon = template.icon;
                      return (
                        <button
                          key={template.id}
                          onClick={() => setMessageType(template.id)}
                          className={`p-3 rounded-lg border transition-all ${
                            messageType === template.id
                              ? 'bg-indigo-600/20 border-indigo-500'
                              : 'bg-slate-700/50 border-slate-600 hover:border-indigo-500/50'
                          }`}
                        >
                          <Icon className={`h-5 w-5 mx-auto mb-2 ${
                            messageType === template.id ? 'text-indigo-400' : 'text-slate-400'
                          }`} />
                          <span className={`text-xs ${
                            messageType === template.id ? 'text-white' : 'text-slate-300'
                          }`}>
                            {template.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recipient */}
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Recipient</label>
                  <Input
                    placeholder="e.g., My future granddaughter, My son's first child..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Delivery Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP") : "Select future date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {deliveryDate && (
                    <p className="text-slate-400 text-xs mt-1">
                      {getYearsUntilDelivery()} years until delivery
                    </p>
                  )}
                </div>

                {/* Message Content */}
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Your Message</label>
                  <Textarea
                    placeholder={`Write your ${selectedTemplate?.name.toLowerCase() || 'message'} here...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-slate-700 border-slate-600 min-h-[120px]"
                  />
                  <p className="text-slate-400 text-xs mt-1">
                    {message.length}/500 characters
                  </p>
                </div>

                {/* Investment Amount */}
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Investment Amount</label>
                  <div className="flex space-x-3">
                    {[15, 25, 50, 100].map((amount) => (
                      <Button
                        key={amount}
                        variant={investment === amount ? "default" : "outline"}
                        size="sm"
                        onClick={() => setInvestment(amount)}
                        className={
                          investment === amount
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "border-slate-600 text-slate-300"
                        }
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Value Projection */}
                {deliveryDate && (
                  <div className="p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg border border-indigo-500/30">
                    <h4 className="text-white font-medium mb-3">Value Projection</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">${investment}</div>
                        <p className="text-slate-400 text-sm">Today's Investment</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-400">
                          ${Math.round(calculateEstimatedValue(investment, getYearsUntilDelivery())).toLocaleString()}
                        </div>
                        <p className="text-slate-400 text-sm">Estimated Value*</p>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min((getYearsUntilDelivery() / 50) * 100, 100)} 
                      className="mt-3 h-2" 
                    />
                    <p className="text-center text-xs text-slate-400 mt-2">
                      {((calculateEstimatedValue(investment, getYearsUntilDelivery()) / investment) * 100 - 100).toFixed(0)}% 
                      estimated return over {getYearsUntilDelivery()} years*
                    </p>
                    <p className="text-center text-xs text-red-400 mt-2">
                      *Projections are estimates only. Not financial advice or guarantees.
                    </p>
                  </div>
                )}

                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  disabled={!message || !recipient || !deliveryDate}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock Message for {getYearsUntilDelivery()} Years (${investment})
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Viral Examples */}
          <div className="space-y-6">
            {/* Time-Lock Message Demo */}
            <Card className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-white font-semibold text-lg mb-2">Time-Lock Message Creation</h3>
                  <p className="text-slate-300 text-sm">See how messages are sealed for future delivery</p>
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto"
                    style={{ maxHeight: '200px' }}
                  >
                    <source src="/capsule_mint_sealed_staked_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3">
                  <Star className="h-6 w-6 text-yellow-400" />
                  <span>Viral Success Stories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {realisticExamples.map((example, index) => (
                    <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-yellow-600/20 text-yellow-400">{example.type}</Badge>
                        <span className="text-slate-400 text-xs">Delivers {example.deliveryYear}</span>
                      </div>
                      
                      <p className="text-slate-300 text-sm italic mb-4">
                        "{example.message}"
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400">Current Value:</span>
                          <div className="text-green-400 font-bold">{example.currentValue}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Estimated Value:</span>
                          <div className="text-purple-400 font-bold">{example.estimatedValue}*</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Recipient:</span>
                          <div className="text-white">{example.recipient}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Years Locked:</span>
                          <div className="text-blue-400">{example.yearsLocked} years</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Templates */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Popular Message Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messageTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <div key={template.id} className="flex items-center space-x-4 p-3 bg-slate-700/20 rounded-lg">
                        <Icon className="h-8 w-8 text-indigo-400" />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{template.name}</h4>
                          <p className="text-slate-400 text-sm">{template.description}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-white">{template.cost}</div>
                          <div className="text-green-400">{template.potential}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Legal Disclaimer */}
                <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-semibold mb-2">Important Disclaimer</h4>
                  <p className="text-red-300 text-xs leading-relaxed">
                    *Value projections are hypothetical estimates based on conservative historical market averages. 
                    These are NOT financial advice, investment recommendations, or guarantees of future performance. 
                    Actual values may be higher or lower, including potential total loss. Platform is for entertainment 
                    and educational purposes. Consult financial advisors before making investment decisions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Every Message Is a Time Machine
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Imagine your future family opening messages you wrote years ago, 
                discovering they're worth more than most investments. 
                The love grows, and so does the value.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Timer className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                  <div className="text-white font-bold">Perfect Timing</div>
                  <p className="text-slate-400 text-sm">Delivered exactly when needed</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-white font-bold">Ultimate Security</div>
                  <p className="text-slate-400 text-sm">Guaranteed delivery decades later</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-white font-bold">Growing Value</div>
                  <p className="text-slate-400 text-sm">Love that appreciates over time</p>
                </div>
              </div>
              
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Your First Time-Lock Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}