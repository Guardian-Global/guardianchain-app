import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Users, Trophy, Zap, Clock } from "lucide-react";

interface ProfileStatsProps {
  capsules: any[];
  badges: any[];
  friends: any[];
}

export default function ProfileStats({ capsules, badges, friends }: ProfileStatsProps) {
  const verifiedCapsules = capsules.filter(c => c.verified);
  const timeSealedCapsules = capsules.filter(c => c.isTimeSealed);
  const recentActivity = capsules.filter(c => 
    new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  const stats = [
    {
      title: "Total Capsules",
      value: capsules.length,
      icon: FileText,
      color: "text-blue-400",
      description: "Truth capsules created"
    },
    {
      title: "Verified",
      value: verifiedCapsules.length,
      icon: Shield,
      color: "text-green-400",
      description: "Community verified"
    },
    {
      title: "Time Sealed",
      value: timeSealedCapsules.length,
      icon: Clock,
      color: "text-purple-400",
      description: "Future unlock capsules"
    },
    {
      title: "Friends",
      value: friends.length,
      icon: Users,
      color: "text-cyan-400",
      description: "Guardian connections"
    },
    {
      title: "Badges",
      value: badges.length,
      icon: Trophy,
      color: "text-yellow-400",
      description: "Achievements earned"
    },
    {
      title: "This Week",
      value: recentActivity.length,
      icon: Zap,
      color: "text-orange-400",
      description: "Recent activity"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="bg-brand-secondary border-brand-surface hover:border-brand-accent/50 transition-colors"
            data-testid={`stat-${stat.title.toLowerCase().replace(' ', '-')}`}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              
              <div className="text-2xl font-bold text-brand-light mb-1">
                {stat.value}
              </div>
              
              <div className="text-xs font-medium text-brand-light/80 mb-1">
                {stat.title}
              </div>
              
              <div className="text-xs text-brand-light/50">
                {stat.description}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}