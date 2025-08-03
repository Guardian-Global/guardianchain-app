import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Upload, 
  Mic, 
  Video, 
  FileText, 
  Image, 
  Shield, 
  Lock, 
  Globe, 
  Users, 
  Calendar,
  Tag,
  MapPin,
  Eye,
  EyeOff,
  Zap,
  Bot,
  Wand2,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const capsuleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
  location: z.string().optional(),
  privacyLevel: z.enum(["public", "private", "encrypted", "time_locked"]),
  unlockDate: z.date().optional(),
  evidenceLevel: z.enum(["basic", "enhanced", "forensic", "legal"]),
  jurisdictions: z.array(z.string()).max(5, "Maximum 5 jurisdictions"),
  isAnonymous: z.boolean(),
  allowVerification: z.boolean(),
  enableNotarization: z.boolean(),
  retentionYears: z.number().min(1).max(100),
});

type CapsuleFormData = z.infer<typeof capsuleSchema>;

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
}

export default function EnhancedCapsuleWorkflow() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [truthScore, setTruthScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const form = useForm<CapsuleFormData>({
    resolver: zodResolver(capsuleSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: [],
      location: "",
      privacyLevel: "public",
      evidenceLevel: "basic",
      jurisdictions: ["US"],
      isAnonymous: false,
      allowVerification: true,
      enableNotarization: false,
      retentionYears: 10,
    },
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const categories = [
    { id: "whistleblowing", label: "Whistleblowing", icon: Shield },
    { id: "testimony", label: "Personal Testimony", icon: Users },
    { id: "historical", label: "Historical Record", icon: Clock },
    { id: "news", label: "News Event", icon: Globe },
    { id: "legal", label: "Legal Document", icon: FileText },
    { id: "research", label: "Research Finding", icon: Target }
  ];

  const jurisdictions = [
    { code: "US", name: "United States" },
    { code: "EU", name: "European Union" },
    { code: "UK", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" }
  ];

  // AI Content Analysis
  const analyzeContent = async (content: string) => {
    if (!content || content.length < 10) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const score = Math.floor(Math.random() * 30) + 70; // 70-100%
      setTruthScore(score);
      
      const suggestions = [
        "Consider adding specific timestamps for better verification",
        "Include geographical context for enhanced credibility",
        "Add emotional context to strengthen authenticity markers",
        "Consider upgrading to enhanced evidence level for legal weight"
      ];
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("AI analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach((file) => {
      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
    });
    
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) added successfully`,
    });
  };

  // Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioFile: UploadedFile = {
          id: `audio_${Date.now()}`,
          name: `voice_recording_${new Date().toISOString().split('T')[0]}.wav`,
          type: 'audio/wav',
          size: blob.size,
          url: URL.createObjectURL(blob)
        };
        
        setUploadedFiles(prev => [...prev, audioFile]);
        setRecordingDuration(0);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start duration timer
      const startTime = Date.now();
      const timer = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      mediaRecorder.onstop = () => {
        clearInterval(timer);
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioFile: UploadedFile = {
          id: `audio_${Date.now()}`,
          name: `voice_recording_${new Date().toISOString().split('T')[0]}.wav`,
          type: 'audio/wav',
          size: blob.size,
          url: URL.createObjectURL(blob)
        };
        
        setUploadedFiles(prev => [...prev, audioFile]);
        setRecordingDuration(0);
        stream.getTracks().forEach(track => track.stop());
      };
      
    } catch (error) {
      console.error("Recording failed:", error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Form submission
  const onSubmit = async (data: CapsuleFormData) => {
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Capsule created successfully",
        description: "Your truth capsule has been sealed and notarized",
      });
      
      // Reset form
      form.reset();
      setCurrentStep(1);
      setUploadedFiles([]);
      setTruthScore(0);
      setAiSuggestions([]);
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Watch content changes for AI analysis
  const contentValue = form.watch("content");
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeContent(contentValue);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [contentValue]);

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Create Truth Capsule</h2>
        <Badge variant="outline" className="text-purple-400">
          Step {currentStep} of {totalSteps}
        </Badge>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between mt-2 text-sm text-gray-400">
        <span>Content</span>
        <span>Media</span>
        <span>Privacy</span>
        <span>Verification</span>
        <span>Review</span>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Content Creation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter a descriptive title..."
                          {...field}
                          className="bg-slate-700/50 border-purple-500/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            type="button"
                            variant={field.value === category.id ? "default" : "outline"}
                            onClick={() => field.onChange(category.id)}
                            className="justify-start gap-2 h-auto p-4"
                          >
                            <category.icon className="w-4 h-4" />
                            <span className="text-sm">{category.label}</span>
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your truth... Be specific, accurate, and authentic."
                          rows={8}
                          {...field}
                          className="bg-slate-700/50 border-purple-500/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* AI Analysis Panel */}
                {(contentValue?.length > 10 || truthScore > 0) && (
                  <Card className="bg-slate-700/30 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Bot className="w-4 h-4 text-cyan-400" />
                        AI Truth Analysis
                        {isAnalyzing && <div className="animate-spin w-3 h-3 border border-cyan-400 border-t-transparent rounded-full" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {truthScore > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Truth Score</span>
                            <Badge 
                              variant={truthScore >= 90 ? "default" : truthScore >= 70 ? "secondary" : "outline"}
                              className={
                                truthScore >= 90 ? "bg-green-500" :
                                truthScore >= 70 ? "bg-yellow-500" : ""
                              }
                            >
                              {truthScore}%
                            </Badge>
                          </div>
                          <Progress value={truthScore} className="h-2" />
                          
                          {aiSuggestions.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-white mb-2">AI Suggestions:</p>
                              <ul className="space-y-1">
                                {aiSuggestions.map((suggestion, index) => (
                                  <li key={index} className="flex items-start gap-2 text-xs text-gray-400">
                                    <Wand2 className="w-3 h-3 mt-0.5 text-cyan-400 flex-shrink-0" />
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400" />
                  Media & Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 flex-col gap-2"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-xs">Upload Files</span>
                  </Button>

                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={isRecording ? stopRecording : startRecording}
                    className="h-20 flex-col gap-2"
                  >
                    <Mic className="w-6 h-6" />
                    <span className="text-xs">
                      {isRecording ? `${recordingDuration}s` : "Record Voice"}
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    disabled
                  >
                    <Video className="w-6 h-6" />
                    <span className="text-xs">Record Video</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    disabled
                  >
                    <Image className="w-6 h-6" />
                    <span className="text-xs">Take Photo</span>
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-3">Uploaded Files</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                          {file.thumbnail ? (
                            <img 
                              src={file.thumbnail} 
                              alt={file.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-purple-500/20 rounded flex items-center justify-center">
                              <FileText className="w-5 h-5 text-purple-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedFiles(files => files.filter(f => f.id !== file.id));
                              URL.revokeObjectURL(file.url);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="privacyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privacy Level</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { value: "public", label: "Public", icon: Globe, desc: "Visible to everyone" },
                          { value: "private", label: "Private", icon: Lock, desc: "Only you can access" },
                          { value: "encrypted", label: "Encrypted", icon: Shield, desc: "End-to-end encrypted" },
                          { value: "time_locked", label: "Time-Locked", icon: Clock, desc: "Unlock at specific date" }
                        ].map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={field.value === option.value ? "default" : "outline"}
                            onClick={() => field.onChange(option.value)}
                            className="justify-start gap-3 h-auto p-4"
                          >
                            <option.icon className="w-5 h-5" />
                            <div className="text-left">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs opacity-70">{option.desc}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("privacyLevel") === "time_locked" && (
                  <FormField
                    control={form.control}
                    name="unlockDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unlock Date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value ? field.value.toISOString().slice(0, 16) : ""}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            className="bg-slate-700/50 border-purple-500/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0">
                        <div>
                          <FormLabel>Anonymous Submission</FormLabel>
                          <p className="text-xs text-gray-400">Hide your identity</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowVerification"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0">
                        <div>
                          <FormLabel>Allow Verification</FormLabel>
                          <p className="text-xs text-gray-400">Community can verify</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Verification & Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="evidenceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evidence Level</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { value: "basic", label: "Basic", desc: "Standard verification", cost: "Free" },
                          { value: "enhanced", label: "Enhanced", desc: "Advanced analysis", cost: "$5 GTT" },
                          { value: "forensic", label: "Forensic", desc: "Professional grade", cost: "$15 GTT" },
                          { value: "legal", label: "Legal", desc: "Court admissible", cost: "$50 GTT" }
                        ].map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={field.value === option.value ? "default" : "outline"}
                            onClick={() => field.onChange(option.value)}
                            className="justify-between h-auto p-4"
                          >
                            <div className="text-left">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs opacity-70">{option.desc}</div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {option.cost}
                            </Badge>
                          </Button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jurisdictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Jurisdictions</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {jurisdictions.map((jurisdiction) => (
                          <Button
                            key={jurisdiction.code}
                            type="button"
                            variant={field.value.includes(jurisdiction.code) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const current = field.value;
                              if (current.includes(jurisdiction.code)) {
                                field.onChange(current.filter(j => j !== jurisdiction.code));
                              } else {
                                field.onChange([...current, jurisdiction.code]);
                              }
                            }}
                          >
                            {jurisdiction.name}
                          </Button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableNotarization"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <div>
                        <FormLabel>Enable Blockchain Notarization</FormLabel>
                        <p className="text-xs text-gray-400">Permanent blockchain record (+$10 GTT)</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="retentionYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retention Period: {field.value} years</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          max={100}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>1 year</span>
                        <span>100 years</span>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    Review & Submit
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {previewMode ? "Edit" : "Preview"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div className="space-y-6">
                    {/* Preview Mode */}
                    <div className="bg-slate-700/30 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-white mb-4">{form.getValues("title")}</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <Badge>{form.getValues("category")}</Badge>
                        <Badge variant="outline">{form.getValues("privacyLevel")}</Badge>
                        <Badge variant="outline">{form.getValues("evidenceLevel")}</Badge>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{form.getValues("content")}</p>
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-3">Attached Evidence</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {uploadedFiles.map((file) => (
                            <div key={file.id} className="bg-slate-700/30 rounded-lg p-3">
                              {file.thumbnail ? (
                                <img 
                                  src={file.thumbnail} 
                                  alt={file.name}
                                  className="w-full h-20 object-cover rounded mb-2"
                                />
                              ) : (
                                <div className="w-full h-20 bg-purple-500/20 rounded flex items-center justify-center mb-2">
                                  <FileText className="w-8 h-8 text-purple-400" />
                                </div>
                              )}
                              <p className="text-xs text-white truncate">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-slate-700/30 border-purple-500/20">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-white mb-2">Content Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Category:</span>
                              <span className="text-white">{form.getValues("category")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Word Count:</span>
                              <span className="text-white">{form.getValues("content")?.split(" ").length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Files:</span>
                              <span className="text-white">{uploadedFiles.length}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-700/30 border-purple-500/20">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-white mb-2">Verification Settings</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Privacy:</span>
                              <span className="text-white">{form.getValues("privacyLevel")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Evidence Level:</span>
                              <span className="text-white">{form.getValues("evidenceLevel")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Notarization:</span>
                              <span className="text-white">
                                {form.getValues("enableNotarization") ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Cost Breakdown */}
                    <Card className="bg-slate-700/30 border-yellow-500/20">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-white mb-3">Cost Breakdown</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Base Creation:</span>
                            <span className="text-white">Free</span>
                          </div>
                          {form.getValues("evidenceLevel") !== "basic" && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Evidence Level:</span>
                              <span className="text-white">
                                {form.getValues("evidenceLevel") === "enhanced" ? "5 GTT" :
                                 form.getValues("evidenceLevel") === "forensic" ? "15 GTT" : "50 GTT"}
                              </span>
                            </div>
                          )}
                          {form.getValues("enableNotarization") && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Notarization:</span>
                              <span className="text-white">10 GTT</span>
                            </div>
                          )}
                          <div className="border-t border-gray-600 pt-2 mt-2">
                            <div className="flex justify-between font-medium">
                              <span className="text-white">Total:</span>
                              <span className="text-yellow-400">
                                {(() => {
                                  let total = 0;
                                  if (form.getValues("evidenceLevel") === "enhanced") total += 5;
                                  if (form.getValues("evidenceLevel") === "forensic") total += 15;
                                  if (form.getValues("evidenceLevel") === "legal") total += 50;
                                  if (form.getValues("enableNotarization")) total += 10;
                                  return total === 0 ? "Free" : `${total} GTT`;
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <StepIndicator />
          
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-500/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  form.reset();
                  setCurrentStep(1);
                  setUploadedFiles([]);
                  setTruthScore(0);
                  setAiSuggestions([]);
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Create Capsule
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}