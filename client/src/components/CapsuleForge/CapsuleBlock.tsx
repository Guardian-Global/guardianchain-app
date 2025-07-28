import { useState } from "react";
import { FileText, Image, Video, Link, Shield, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Block {
  id: number;
  type: string;
  content: string;
}

interface CapsuleBlockProps {
  block: Block;
  onUpdate: (content: string) => void;
}

export default function CapsuleBlock({ block, onUpdate }: CapsuleBlockProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onUpdate(`Uploaded: ${file.name}`);
    setIsUploading(false);
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "image":
        return <Image className="w-4 h-4 text-green-400" />;
      case "video":
        return <Video className="w-4 h-4 text-red-400" />;
      case "link":
        return <Link className="w-4 h-4 text-purple-400" />;
      case "seal":
        return <Shield className="w-4 h-4 text-yellow-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBlockLabel = (type: string) => {
    switch (type) {
      case "text":
        return "Text Content";
      case "image":
        return "Image Upload";
      case "video":
        return "Video Embed";
      case "link":
        return "External Link";
      case "seal":
        return "Veritas Seal";
      default:
        return "Content Block";
    }
  };

  if (block.type === "text") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {getBlockIcon(block.type)}
          <span className="text-sm font-medium text-slate-300">
            {getBlockLabel(block.type)}
          </span>
        </div>
        <Textarea
          placeholder="Enter your truth content here. Be detailed and factual..."
          value={block.content}
          onChange={(e) => onUpdate(e.target.value)}
          className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 min-h-32 resize-none"
        />
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{block.content.length} characters</span>
          <span>Markdown supported</span>
        </div>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {getBlockIcon(block.type)}
          <span className="text-sm font-medium text-slate-300">
            {getBlockLabel(block.type)}
          </span>
        </div>

        {block.content ? (
          <div className="bg-slate-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-400">✓ {block.content}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdate("")}
                className="text-slate-400 hover:text-white"
              >
                Change
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
              id={`image-upload-${block.id}`}
            />
            <label
              htmlFor={`image-upload-${block.id}`}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {isUploading ? (
                <div className="animate-spin w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full" />
              ) : (
                <Upload className="w-6 h-6 text-slate-400" />
              )}
              <span className="text-sm text-slate-400">
                {isUploading ? "Uploading..." : "Click to upload image"}
              </span>
              <span className="text-xs text-slate-500">
                PNG, JPG, WEBP up to 10MB
              </span>
            </label>
          </div>
        )}
      </div>
    );
  }

  if (block.type === "video") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {getBlockIcon(block.type)}
          <span className="text-sm font-medium text-slate-300">
            {getBlockLabel(block.type)}
          </span>
        </div>
        <Input
          type="url"
          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          value={block.content}
          onChange={(e) => onUpdate(e.target.value)}
          className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
        />
        {block.content && (
          <div className="bg-slate-600 rounded p-2">
            <span className="text-xs text-green-400">✓ Video URL added</span>
          </div>
        )}
      </div>
    );
  }

  if (block.type === "link") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {getBlockIcon(block.type)}
          <span className="text-sm font-medium text-slate-300">
            {getBlockLabel(block.type)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="text"
            placeholder="Link title"
            value={block.content.split("|")[0] || ""}
            onChange={(e) => {
              const url = block.content.split("|")[1] || "";
              onUpdate(`${e.target.value}|${url}`);
            }}
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
          />
          <Input
            type="url"
            placeholder="URL"
            value={block.content.split("|")[1] || ""}
            onChange={(e) => {
              const title = block.content.split("|")[0] || "";
              onUpdate(`${title}|${e.target.value}`);
            }}
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
          />
        </div>
      </div>
    );
  }

  if (block.type === "seal") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {getBlockIcon(block.type)}
          <span className="text-sm font-medium text-slate-300">
            {getBlockLabel(block.type)}
          </span>
          <Badge className="bg-yellow-600 text-white text-xs">Premium</Badge>
        </div>
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">Veritas Seal</span>
              </div>
              <p className="text-sm text-slate-300">
                This will add an official verification seal to your capsule
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Cost: 100 GTT • Requires DocuSign verification
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
              disabled
            >
              Configure
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {getBlockIcon(block.type)}
        <span className="text-sm font-medium text-slate-300">
          {getBlockLabel(block.type)}
        </span>
      </div>
      <div className="bg-slate-600 rounded p-4 text-center text-slate-400">
        <span className="text-sm">Block type: {block.type}</span>
      </div>
    </div>
  );
}
