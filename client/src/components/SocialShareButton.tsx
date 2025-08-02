import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { motion } from "framer-motion";

interface SocialShareButtonProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
}

export function SocialShareButton({
  url,
  title,
  description = "Verified truth on GUARDIANCHAIN - the future of information integrity",
  hashtags = ["GUARDIANCHAIN", "TruthVerification", "Web3"],
}: SocialShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description),
    hashtags: hashtags.join(","),
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}&hashtags=${shareData.hashtags}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="social-share-hover">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => openShare("twitter")}
          className="cursor-pointer"
        >
          <Twitter className="mr-2 h-4 w-4 text-blue-400" />
          <span>Share on Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openShare("facebook")}
          className="cursor-pointer"
        >
          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openShare("linkedin")}
          className="cursor-pointer"
        >
          <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
          <span>Share on LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          <motion.div
            initial={false}
            animate={{ scale: copied ? 1.1 : 1 }}
            transition={{ duration: 0.1 }}
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
          </motion.div>
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
