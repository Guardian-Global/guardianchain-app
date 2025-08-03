import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Twitter, Globe, Mail } from "lucide-react";

interface SocialLinksCardProps {
  profile: {
    twitter?: string;
    website?: string;
    email?: string;
    ens?: string;
    discord?: string;
    telegram?: string;
  };
}

export default function SocialLinksCard({ profile }: SocialLinksCardProps) {
  const socialLinks = [
    {
      name: "Twitter",
      value: profile.twitter,
      url: profile.twitter ? `https://twitter.com/${profile.twitter}` : null,
      icon: Twitter,
      color: "text-blue-400 hover:text-blue-300",
    },
    {
      name: "Website",
      value: profile.website,
      url: profile.website,
      icon: Globe,
      color: "text-green-400 hover:text-green-300",
    },
    {
      name: "Email",
      value: profile.email,
      url: profile.email ? `mailto:${profile.email}` : null,
      icon: Mail,
      color: "text-purple-400 hover:text-purple-300",
    },
  ];

  const validLinks = socialLinks.filter(link => link.value);

  if (validLinks.length === 0) {
    return null;
  }

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {validLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.name}
                variant="outline"
                size="sm"
                asChild
                className={`border-brand-light/20 ${link.color} hover:bg-brand-light/10`}
                data-testid={`link-${link.name.toLowerCase()}`}
              >
                <a
                  href={link.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Icon className="w-3 h-3" />
                  <span className="text-xs">
                    {link.name === "Twitter" ? `@${link.value}` : 
                     link.name === "Website" ? "Website" :
                     link.name === "Email" ? "Email" : link.value}
                  </span>
                  <ExternalLink className="w-2 h-2" />
                </a>
              </Button>
            );
          })}
          
          {profile.ens && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-brand-surface border border-brand-light/20">
              <span className="text-xs text-brand-warning font-mono">{profile.ens}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}