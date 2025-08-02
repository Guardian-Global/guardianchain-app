import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, Share2, Calendar, User, Tag, Shield, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import VoteButton from "@/components/VoteButton";

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
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userWallet, setUserWallet] = useState<string>("");

  useEffect(() => {
    if (match && params?.id) {
      fetchCapsule(params.id);
    }
    // Try to get wallet address from localStorage or window.ethereum
    const checkWallet = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setUserWallet(accounts[0]);
          }
        } catch (error) {
          console.log("No wallet connected");
        }
      }
    };
    checkWallet();
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
      setLikeCount(parseInt(data.capsule.likes || "0"));
      
      // Check if capsule is already minted
      if (data.capsule.content?.minted && data.capsule.content?.tx_hash) {
        setMinted(true);
        setTxHash(data.capsule.content.tx_hash);
      }
      
      // Check if capsule is already unlocked
      if (data.capsule.content?.unlocked) {
        setUnlocked(true);
      }
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

  const handleMint = async () => {
    if (!capsule) return;
    
    setMinting(true);
    try {
      const response = await fetch(`/api/capsules/${capsule.id}/mint`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      
      if (data.txHash) {
        setTxHash(data.txHash);
        setMinted(true);
        alert(`Capsule minted on-chain! Transaction: ${data.txHash}`);
      } else {
        alert(data.error || "Minting failed. Please try again.");
      }
    } catch (error) {
      console.error("Minting error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setMinting(false);
    }
  };

  const handleLike = async () => {
    if (!capsule) return;
    
    try {
      const response = await fetch(`/api/capsules/${capsule.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (response.ok) {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: capsule?.title,
        text: capsule?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleUnlock = async () => {
    if (!capsule) return;
    
    setUnlocking(true);
    try {
      const response = await fetch(`/api/capsules/${capsule.id}/unlock`);
      const data = await response.json();
      
      if (data.capsule) {
        let updatedCapsule = data.capsule;
        
        // If the capsule was encrypted and we have encrypted data, try client-side decryption
        if (data.capsule.content?.encryptedContent && data.capsule.content?.encryptedSymmetricKey) {
          try {
            const { decryptCapsule } = await import("../utils/lit/decryptCapsule");
            
            const decryptedContent = await decryptCapsule({
              encryptedContent: data.capsule.content.encryptedContent,
              encryptedSymmetricKey: data.capsule.content.encryptedSymmetricKey,
              accessControlConditions: data.capsule.content.accessControlConditions || [],
              chain: "polygon",
            });
            
            // Update capsule with decrypted content
            updatedCapsule = {
              ...updatedCapsule,
              description: decryptedContent,
              content: {
                ...updatedCapsule.content,
                unlocked: true
              }
            };
          } catch (decryptError) {
            console.error("Client-side decryption failed:", decryptError);
            // Server has already provided decrypted content as fallback
          }
        }
        
        setCapsule(updatedCapsule);
        setUnlocked(true);
        alert("Capsule unlocked successfully! Hidden content is now visible.");
      } else {
        alert(data.error || "Unlock failed. Please try again.");
      }
    } catch (error) {
      console.error("Unlock error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setUnlocking(false);
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
                {minted && txHash && (
                  <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 dark:text-green-400 text-sm hover:underline mb-2"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    ✅ Minted on Polygon - View Transaction
                  </a>
                )}
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
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {capsule.content?.encrypted && !unlocked ? (
                  <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <svg className="w-5 h-5 mr-3 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">Encrypted Content</p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        🔒 Capsule is locked. Unlock required to view content.
                      </p>
                      {capsule.content?.accessControlConditions && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          Access controlled by blockchain conditions
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p>{capsule.description || "No description provided."}</p>
                )}
              </div>
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
                    <Heart className="w-5 h-5 mr-1 text-gray-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {likeCount.toLocaleString()}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Interact</h4>
                  <div className="flex flex-wrap gap-2">
                    <VoteButton
                      capsuleId={capsule.id}
                      wallet={userWallet}
                      initialLikes={parseInt(capsule.likes || "0")}
                    />
                    <Button variant="outline" size="sm" className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comment
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleShare}
                      className="flex items-center"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Blockchain Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {!minted && (
                      <Button 
                        onClick={handleMint}
                        disabled={minting}
                        className="flex items-center"
                      >
                        {minting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Minting...
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Mint On-Chain
                          </>
                        )}
                      </Button>
                    )}
                    {!unlocked && capsule.content?.encrypted && (
                      <Button 
                        variant="outline" 
                        onClick={handleUnlock}
                        disabled={unlocking}
                        className="flex items-center border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/20"
                      >
                        {unlocking ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Decrypting...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                            </svg>
                            Decrypt Content
                          </>
                        )}
                      </Button>
                    )}
                    {minted && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Shield className="w-3 h-3 mr-1" />
                        Minted on Blockchain
                      </Badge>
                    )}
                    {unlocked && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Eye className="w-3 h-3 mr-1" />
                        Content Unlocked
                      </Badge>
                    )}
                    {capsule.content?.encrypted && !unlocked && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        🔒 Encrypted
                      </Badge>
                    )}
                    {capsule.isPrivate && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Private Vault
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Capsule ID:</strong> {capsule.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}