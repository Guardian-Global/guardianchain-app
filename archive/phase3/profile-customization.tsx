import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  User,
  Crown,
  Shield,
  Zap,
  Camera,
  Save,
  Settings,
} from "lucide-react";
import { LogoDisplay } from "@/components/assets/LogoDisplay";
import { useAssets } from "@/components/assets/AssetProvider";

export default function ProfileCustomization() {
  const { assets, nftIcons, loading: assetsLoading } = useAssets();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    title: "Founder & CEO",
    bio: "",
    location: "Global",
    website: "https://guardianchain.org",
    twitter: "@guardianchain",
    linkedin: "guardianchain",
    profileImage: "",
    coverImage: "",
    expertise: [] as string[],
    achievements: [] as string[],
    accessLevel: "founder",
  });

  const [activeTab, setActiveTab] = useState("basic");

  const expertiseOptions = [
    "Blockchain Architecture",
    "DeFi Protocols",
    "Smart Contracts",
    "Tokenomics",
    "Web3 Strategy",
    "Decentralized Governance",
    "Security Auditing",
    "Protocol Design",
    "Token Economics",
    "NFT Development",
    "Cross-chain Integration",
    "Layer 2 Solutions",
  ];

  const achievementOptions = [
    "GUARDIANCHAIN Founder",
    "GTT Token Creator",
    "Protocol Architect",
    "DeFi Pioneer",
    "Web3 Innovator",
    "Blockchain Evangelist",
    "Truth Verification Expert",
    "Decentralization Advocate",
    "Smart Contract Auditor",
    "Tokenomics Designer",
    "DAO Governance Expert",
    "NFT Collection Creator",
  ];

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "assets", label: "Profile Assets", icon: Camera },
    { id: "expertise", label: "Expertise", icon: Crown },
    { id: "achievements", label: "Achievements", icon: Shield },
    { id: "advanced", label: "Advanced", icon: Settings },
  ];

  const handleSaveProfile = () => {
    localStorage.setItem("masterProfile", JSON.stringify(profile));
    console.log("Profile saved:", profile);
  };

  const selectProfileImage = (asset: any) => {
    setProfile((prev) => ({ ...prev, profileImage: asset.url }));
  };

  const toggleExpertise = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(skill)
        ? prev.expertise.filter((s) => s !== skill)
        : [...prev.expertise, skill],
    }));
  };

  const toggleAchievement = (achievement: string) => {
    setProfile((prev) => ({
      ...prev,
      achievements: prev.achievements.includes(achievement)
        ? prev.achievements.filter((a) => a !== achievement)
        : [...prev.achievements, achievement],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LogoDisplay
                size="xl"
                variant="main"
                className="h-16"
                fallback={
                  <div className="h-16 w-auto bg-gradient-to-r from-purple-600 to-green-500 rounded-lg flex items-center justify-center px-6">
                    <span className="text-white font-bold text-2xl">
                      GUARDIANCHAIN
                    </span>
                  </div>
                }
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Profile Customization
            </h1>
            <p className="text-slate-300 text-lg">
              Customize your founder profile and master access settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800/80 border-slate-700 sticky top-24">
                <CardContent className="p-6">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? "bg-purple-600 text-white"
                              : "text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="bg-slate-800/80 border-slate-700">
                <CardContent className="p-8">
                  {/* Basic Info Tab */}
                  {activeTab === "basic" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Basic Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-white mb-2 block">
                            First Name
                          </Label>
                          <Input
                            value={profile.firstName}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            placeholder="Your first name"
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-white mb-2 block">
                            Last Name
                          </Label>
                          <Input
                            value={profile.lastName}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            placeholder="Your last name"
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-white mb-2 block">Title</Label>
                          <Input
                            value={profile.title}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Founder & CEO"
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-white mb-2 block">
                            Location
                          </Label>
                          <Input
                            value={profile.location}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            placeholder="Global"
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Bio</Label>
                        <Textarea
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          placeholder="Tell the world about your mission with GUARDIANCHAIN..."
                          className="bg-slate-900 border-slate-600 text-white min-h-[120px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-white mb-2 block">
                            Website
                          </Label>
                          <Input
                            value={profile.website}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                website: e.target.value,
                              }))
                            }
                            placeholder="https://guardianchain.org"
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-white mb-2 block">
                            Twitter
                          </Label>
                          <Input
                            value={profile.twitter}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                twitter: e.target.value,
                              }))
                            }
                            placeholder="@guardianchain"
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-white mb-2 block">
                            LinkedIn
                          </Label>
                          <Input
                            value={profile.linkedin}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                linkedin: e.target.value,
                              }))
                            }
                            placeholder="guardianchain"
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile Assets Tab */}
                  {activeTab === "assets" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Profile Assets
                        </h2>
                        <p className="text-slate-300 mb-6">
                          Choose your profile image from your Supabase assets
                        </p>
                      </div>

                      {/* Current Profile Image */}
                      <div className="bg-slate-900 rounded-lg p-6">
                        <Label className="text-white mb-4 block">
                          Current Profile Image
                        </Label>
                        <div className="flex items-center space-x-4">
                          {profile.profileImage ? (
                            <img
                              src={profile.profileImage}
                              alt="Profile"
                              className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-green-500 flex items-center justify-center">
                              <User className="w-12 h-12 text-white" />
                            </div>
                          )}
                          <div className="text-white">
                            <p className="font-semibold">
                              {profile.firstName || "Your"}{" "}
                              {profile.lastName || "Name"}
                            </p>
                            <p className="text-slate-400">{profile.title}</p>
                          </div>
                        </div>
                      </div>

                      {/* Asset Gallery */}
                      {!assetsLoading && assets.length > 0 && (
                        <div>
                          <Label className="text-white mb-4 block">
                            Choose from Your Assets
                          </Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {assets
                              .filter((asset) => asset.type === "image")
                              .slice(0, 12)
                              .map((asset, index) => (
                                <button
                                  key={index}
                                  onClick={() => selectProfileImage(asset)}
                                  className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                                    profile.profileImage === asset.url
                                      ? "border-purple-500 ring-2 ring-purple-500/20"
                                      : "border-slate-600 hover:border-slate-500"
                                  }`}
                                >
                                  <img
                                    src={asset.url}
                                    alt={asset.name}
                                    className="w-full aspect-square object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white" />
                                  </div>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expertise Tab */}
                  {activeTab === "expertise" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Expertise & Skills
                        </h2>
                        <p className="text-slate-300 mb-6">
                          Select your areas of expertise in blockchain and Web3
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {expertiseOptions.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => toggleExpertise(skill)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              profile.expertise.includes(skill)
                                ? "border-purple-500 bg-purple-500/10 text-white"
                                : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{skill}</span>
                              {profile.expertise.includes(skill) && (
                                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="bg-slate-900 rounded-lg p-6">
                        <Label className="text-white mb-4 block">
                          Selected Expertise ({profile.expertise.length})
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.expertise.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-purple-600 text-white"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Achievements Tab */}
                  {activeTab === "achievements" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Achievements & Recognition
                        </h2>
                        <p className="text-slate-300 mb-6">
                          Highlight your accomplishments and recognition in the
                          space
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievementOptions.map((achievement) => (
                          <button
                            key={achievement}
                            onClick={() => toggleAchievement(achievement)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              profile.achievements.includes(achievement)
                                ? "border-green-500 bg-green-500/10 text-white"
                                : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{achievement}</span>
                              {profile.achievements.includes(achievement) && (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="bg-slate-900 rounded-lg p-6">
                        <Label className="text-white mb-4 block">
                          Selected Achievements ({profile.achievements.length})
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.achievements.map((achievement) => (
                            <Badge
                              key={achievement}
                              variant="secondary"
                              className="bg-green-600 text-white"
                            >
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Advanced Tab */}
                  {activeTab === "advanced" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Advanced Settings
                        </h2>
                        <p className="text-slate-300 mb-6">
                          Configure advanced profile and access settings
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-white mb-2 block">
                            Access Level
                          </Label>
                          <Select
                            value={profile.accessLevel}
                            onValueChange={(value) =>
                              setProfile((prev) => ({
                                ...prev,
                                accessLevel: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="founder">Founder</SelectItem>
                              <SelectItem value="commander">
                                Commander
                              </SelectItem>
                              <SelectItem value="architect">
                                Architect
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="bg-slate-900 rounded-lg p-6">
                        <h3 className="text-white font-semibold mb-4">
                          Profile Preview
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            {profile.profileImage ? (
                              <img
                                src={profile.profileImage}
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-green-500 flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                              </div>
                            )}
                            <div>
                              <h4 className="text-white font-bold text-xl">
                                {profile.firstName} {profile.lastName}{" "}
                                {!profile.firstName &&
                                  !profile.lastName &&
                                  "Your Name"}
                              </h4>
                              <p className="text-purple-400">{profile.title}</p>
                              <p className="text-slate-400">
                                {profile.location}
                              </p>
                            </div>
                          </div>
                          {profile.bio && (
                            <p className="text-slate-300">{profile.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex justify-center pt-8 border-t border-slate-700">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-8 py-3"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save Profile Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
