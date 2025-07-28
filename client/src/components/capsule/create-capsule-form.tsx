import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Upload,
  FileText,
  Image,
  Link as LinkIcon,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CAPSULE_CATEGORIES } from "@/lib/constants";

const createCapsuleFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10,000 characters"),
  category: z.string().min(1, "Category is required"),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
  evidence: z
    .array(
      z.object({
        type: z.enum(["link", "document", "image", "video", "other"]),
        url: z.string().url("Must be a valid URL"),
        description: z.string().min(1, "Description is required"),
      })
    )
    .optional(),
});

type CreateCapsuleFormData = z.infer<typeof createCapsuleFormSchema>;

interface CreateCapsuleFormProps {
  onSubmit: (data: CreateCapsuleFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CreateCapsuleForm({
  onSubmit,
  isSubmitting = false,
}: CreateCapsuleFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [evidence, setEvidence] = useState<
    Array<{ type: string; url: string; description: string }>
  >([]);
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [newEvidence, setNewEvidence] = useState({
    type: "link",
    url: "",
    description: "",
  });
  const { toast } = useToast();

  const form = useForm<CreateCapsuleFormData>({
    resolver: zodResolver(createCapsuleFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      category: "",
      isPublic: true,
      tags: [],
      evidence: [],
    },
  });

  const handleSubmit = async (data: CreateCapsuleFormData) => {
    const formData = {
      ...data,
      tags: tags.length > 0 ? tags : undefined,
      evidence: evidence.length > 0 ? evidence : undefined,
    };

    try {
      await onSubmit(formData);
      form.reset();
      setTags([]);
      setEvidence([]);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addEvidence = () => {
    if (newEvidence.url && newEvidence.description) {
      setEvidence([...evidence, { ...newEvidence }]);
      setNewEvidence({ type: "link", url: "", description: "" });
      setShowEvidenceForm(false);
    }
  };

  const removeEvidence = (index: number) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Upload className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a compelling title for your truth capsule"
                      className="bg-slate-800 border-slate-600 focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title that summarizes your claim or
                    statement.
                  </FormDescription>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-800 border-slate-600 focus:border-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CAPSULE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the most relevant category for your capsule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief description of your truth capsule"
                      className="bg-slate-800 border-slate-600 focus:border-primary min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A summary that will be visible in capsule previews and
                    search results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-600 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Capsule</FormLabel>
                    <FormDescription>
                      Make this capsule visible to all users and eligible for
                      community verification.
                    </FormDescription>
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

          <div className="space-y-6">
            {/* Tags Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/20 text-primary border-primary/30"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="bg-slate-900 border-slate-600 focus:border-primary"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-400">
                  Add relevant tags to help others discover your capsule.
                </p>
              </CardContent>
            </Card>

            {/* Evidence Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Supporting Evidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {evidence.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg"
                  >
                    <div className="text-slate-400">
                      {getEvidenceIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-200 truncate">
                        {item.description}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {item.url}
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeEvidence(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {showEvidenceForm ? (
                  <div className="space-y-3 p-3 bg-slate-900/50 rounded-lg">
                    <Select
                      value={newEvidence.type}
                      onValueChange={(value) =>
                        setNewEvidence({ ...newEvidence, type: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="URL"
                      value={newEvidence.url}
                      onChange={(e) =>
                        setNewEvidence({ ...newEvidence, url: e.target.value })
                      }
                      className="bg-slate-800 border-slate-600"
                    />
                    <Input
                      placeholder="Description"
                      value={newEvidence.description}
                      onChange={(e) =>
                        setNewEvidence({
                          ...newEvidence,
                          description: e.target.value,
                        })
                      }
                      className="bg-slate-800 border-slate-600"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={addEvidence}
                        size="sm"
                        className="gradient-primary"
                      >
                        Add Evidence
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowEvidenceForm(false)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setShowEvidenceForm(true)}
                    variant="outline"
                    className="w-full border-slate-600 hover:bg-slate-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Evidence
                  </Button>
                )}

                <p className="text-xs text-slate-400">
                  Add supporting evidence to strengthen your capsule's
                  credibility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide detailed content, evidence, and supporting information. Include sources, methodology, and reasoning."
                  className="bg-slate-800 border-slate-600 focus:border-primary min-h-[300px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include all relevant details, sources, evidence, and reasoning.
                The more comprehensive and well-documented, the better your
                verification chances.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 gradient-primary hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 transition-all duration-200"
          >
            {isSubmitting ? "Creating Capsule..." : "Create Truth Capsule"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setTags([]);
              setEvidence([]);
            }}
            className="border-slate-600 hover:bg-slate-700"
          >
            Clear Form
          </Button>
        </div>
      </form>
    </Form>
  );
}
