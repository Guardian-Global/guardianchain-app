import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, Share2, Calendar, User, Tag, Shield, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface CapsuleData {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags?: string[];
  verification_status: "verified" | "pending" | "rejected";
  grief_score: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  created_at: string;
  content?: {
    type: string;
    data: string;
    metadata?: any;
  };
}

export default function CapsuleDetailPage() {
  const [match, params] = useRoute("/capsule/:id");
  const [capsule, setCapsule] = useState<CapsuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (match && params?.id) {
      fetchCapsule(params.id);
    }
  }, [match, params]);

  const fetchCapsule = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/capsules/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch capsule");
      }
      
      const data = await response.json();
      setCapsule(data.capsule);
    } catch (err) {
      console.error("Error fetching capsule:", err);
      setError("Failed to load capsule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (!match) {
    return <div>Page not found</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto p-4 md:p-6">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">Loading capsule...</span>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto p-4 md:p-6">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Capsule Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {error || "The requested capsule could not be found."}
              </p>
              <Link href="/search">
                <Button>Search Capsules</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/search">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>

        {/* Main Capsule Content */}
        <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {capsule.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {capsule.author}
                  </span>
                  <span className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    {capsule.category}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(capsule.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(capsule.verification_status)}>
                  <Shield className="w-3 h-3 mr-1" />
                  {capsule.verification_status}
                </Badge>
                <Badge variant="outline">
                  Grief Score: {capsule.grief_score}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {capsule.description || "No description provided."}
              </p>
            </div>

            {/* Content */}
            {capsule.content && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Content
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {capsule.content.data}
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            {capsule.tags && capsule.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {capsule.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Metrics */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="w-5 h-5 text-gray-500 mr-1" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {parseInt(capsule.views).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Views</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="w-5 h-5 text-gray-500 mr-1" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {parseInt(capsule.likes).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Likes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircle className="w-5 h-5 text-gray-500 mr-1" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {parseInt(capsule.comments).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Comments</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Share2 className="w-5 h-5 text-gray-500 mr-1" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {parseInt(capsule.shares).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Shares</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="flex flex-wrap gap-3">
                <Button className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Like Capsule
                </Button>
                <Button variant="outline" className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Truth
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}