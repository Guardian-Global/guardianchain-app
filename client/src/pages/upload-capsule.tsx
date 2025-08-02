import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileImage, FileVideo, Check, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function UploadCapsule() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [capsuleId, setCapsuleId] = useState<string | null>(null);
  const [storageSize, setStorageSize] = useState<string>("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    // Extract parameters from URL
    const params = new URLSearchParams(window.location.search);
    const size = params.get("size");
    const sessionId = params.get("session_id");

    if (size) {
      setStorageSize(size);
    }

    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, []);

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/checkout/verify-payment/${sessionId}`);
      const data = await response.json();

      if (data.success) {
        setPaymentVerified(true);
        toast({
          title: "Payment Confirmed",
          description: `Storage capsule (${data.storageSize}) purchased successfully!`,
        });
      } else {
        toast({
          title: "Payment Verification Failed",
          description: "Please contact support if payment was completed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Unable to verify payment status",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file size based on storage tier
      const maxSizes = {
        "64GB": 64 * 1024 * 1024 * 1024,
        "128GB": 128 * 1024 * 1024 * 1024,
        "256GB": 256 * 1024 * 1024 * 1024,
        "512GB": 512 * 1024 * 1024 * 1024,
        "1TB": 1024 * 1024 * 1024 * 1024,
        "2TB": 2048 * 1024 * 1024 * 1024,
      };

      const maxSize =
        maxSizes[storageSize as keyof typeof maxSizes] || 100 * 1024 * 1024; // 100MB default

      if (selectedFile.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `File exceeds ${storageSize} limit`,
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !paymentVerified) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("storageSize", storageSize);

      const user = JSON.parse(localStorage.getItem("auth_user") || "{}");
      formData.append("userId", user.id || "anonymous");

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/capsules/upload-secure", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (data.success) {
        setCapsuleId(data.capsuleId);
        toast({
          title: "Capsule Sealed Successfully",
          description: `Your capsule has been encrypted and stored securely. ID: ${data.capsuleId}`,
        });
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload and seal capsule",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="w-12 h-12 text-gray-400" />;

    if (file.type.startsWith("image/")) {
      return <FileImage className="w-12 h-12 text-blue-400" />;
    } else if (file.type.startsWith("video/")) {
      return <FileVideo className="w-12 h-12 text-purple-400" />;
    }
    return <Upload className="w-12 h-12 text-green-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!paymentVerified) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Payment Verification Required
              </h2>
              <p className="text-gray-300 mb-6">
                Please complete your payment first or verify your payment
                status.
              </p>
              <Button
                onClick={() => (window.location.href = "/storage-capsules")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Go to Storage Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (capsuleId) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Capsule Sealed Successfully!
              </h2>
              <p className="text-gray-300 mb-4">
                Your file has been encrypted and stored securely in the
                blockchain.
              </p>
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">Capsule ID</p>
                <p className="font-mono text-purple-400">{capsuleId}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/explorer")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  View in Explorer
                </Button>
                <Button
                  onClick={() => (window.location.href = "/storage-capsules")}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Upload Your Capsule</h1>
          <p className="text-gray-300">
            Securely upload and encrypt your precious memories ({storageSize}{" "}
            capacity)
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex justify-center mb-2">{getFileIcon()}</div>
              {file ? file.name : "Select File to Upload"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* File Selection */}
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">
                  Click to select file or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  Supports images, videos, audio, documents (up to {storageSize}
                  )
                </p>
              </label>
            </div>

            {/* File Info */}
            {file && (
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {file.type || "Unknown type"}
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Uploading and encrypting...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3"
            >
              {uploading ? "Sealing Capsule..." : "Upload & Seal Capsule"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
