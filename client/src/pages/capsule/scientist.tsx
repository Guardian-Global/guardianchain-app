import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Beaker, FileText, Users, Calendar, Award, Upload, Loader2 } from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function ScientistCapsulePage() {
  const { toast } = useToast();
  const [researchTitle, setResearchTitle] = useState("");
  const [researcherName, setResearcherName] = useState("");
  const [institution, setInstitution] = useState("");
  const [field, setField] = useState("");
  const [methodology, setMethodology] = useState("");
  const [findings, setFindings] = useState("");
  const [implications, setImplications] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [dataFiles, setDataFiles] = useState<File[]>([]);
  const [publicationDate, setPublicationDate] = useState("");

  const researchFields = [
    "Biology", "Chemistry", "Physics", "Environmental Science", "Medicine", 
    "Psychology", "Computer Science", "Engineering", "Mathematics", "Earth Science", "Other"
  ];

  const createResearchCapsuleMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/capsule/scientist", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Research Capsule Created",
        description: "Your scientific research has been documented for verification.",
      });
      // Reset form
      setResearchTitle("");
      setResearcherName("");
      setInstitution("");
      setField("");
      setMethodology("");
      setFindings("");
      setImplications("");
      setCollaborators("");
      setDataFiles([]);
      setPublicationDate("");
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create research capsule.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDataFiles(files);
  };

  const handleSubmit = () => {
    if (!researchTitle.trim() || !researcherName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide at least research title and researcher name.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("researchTitle", researchTitle.trim());
    formData.append("researcherName", researcherName.trim());
    formData.append("institution", institution.trim());
    formData.append("field", field.trim());
    formData.append("methodology", methodology.trim());
    formData.append("findings", findings.trim());
    formData.append("implications", implications.trim());
    formData.append("collaborators", collaborators.trim());
    formData.append("publicationDate", publicationDate);
    formData.append("capsuleType", "SCIENTIST");
    
    dataFiles.forEach((file, index) => {
      formData.append(`data_${index}`, file);
    });

    createResearchCapsuleMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Scientist Capsule</h1>
          <p className="text-slate-400">
            Document and verify scientific research with transparent methodology and data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Research Capsule */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Beaker className="w-5 h-5" style={{ color: BRAND_COLORS.CHAIN }} />
                  Research Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Research Title *</label>
                    <Input
                      value={researchTitle}
                      onChange={(e) => setResearchTitle(e.target.value)}
                      placeholder="Title of your research study"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Researcher Name *</label>
                    <Input
                      value={researcherName}
                      onChange={(e) => setResearcherName(e.target.value)}
                      placeholder="Principal researcher name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Institution</label>
                    <Input
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="University or research institution"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Research Field</label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                    >
                      <option value="">Select field</option>
                      {researchFields.map((fieldName) => (
                        <option key={fieldName} value={fieldName}>
                          {fieldName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Publication Date</label>
                    <Input
                      type="date"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Research Methodology</label>
                  <Textarea
                    value={methodology}
                    onChange={(e) => setMethodology(e.target.value)}
                    placeholder="Describe your research methods, experimental design, data collection procedures..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Key Findings</label>
                  <Textarea
                    value={findings}
                    onChange={(e) => setFindings(e.target.value)}
                    placeholder="Summarize your main research findings and results..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Implications & Significance</label>
                  <Textarea
                    value={implications}
                    onChange={(e) => setImplications(e.target.value)}
                    placeholder="What are the broader implications of your research for science and society?"
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Collaborators & Credits</label>
                  <Textarea
                    value={collaborators}
                    onChange={(e) => setCollaborators(e.target.value)}
                    placeholder="List co-researchers, institutions, or organizations that contributed to this research..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[60px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Research Data & Files</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.csv,.xlsx,.json,.txt,.zip"
                      onChange={handleFileChange}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                    <Upload className="w-4 h-4 text-slate-400" />
                  </div>
                  {dataFiles.length > 0 && (
                    <div className="text-sm text-slate-400">
                      {dataFiles.length} file(s) selected
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createResearchCapsuleMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {createResearchCapsuleMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Research Capsule...
                    </>
                  ) : (
                    <>
                      <Beaker className="w-4 h-4 mr-2" />
                      Create Research Capsule
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Guidelines & Features */}
          <div className="space-y-6">
            {/* Features */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Award className="w-4 h-4" style={{ color: BRAND_COLORS.CHAIN }} />
                  Research Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Data Integrity:</strong> Immutable research records
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Peer Review:</strong> Community verification process
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Timestamp Proof:</strong> Publication date verification
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Attribution:</strong> Proper research credit
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Research */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Research</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "Climate Change Adaptation Strategies",
                    researcher: "Dr. Sarah Johnson",
                    field: "Environmental Science",
                    date: "2025-01-20",
                  },
                  {
                    title: "AI Ethics in Healthcare Applications",
                    researcher: "Prof. Michael Chen",
                    field: "Computer Science",
                    date: "2025-01-18",
                  },
                  {
                    title: "Renewable Energy Storage Solutions",
                    researcher: "Dr. Elena Rodriguez",
                    field: "Engineering",
                    date: "2025-01-15",
                  },
                ].map((research, index) => (
                  <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-white text-sm">{research.title}</h4>
                      <Badge variant="outline" className="text-blue-400 border-blue-600 text-xs">
                        {research.field}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      <div>By: {research.researcher}</div>
                      <div>Published: {new Date(research.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">How Research Capsules Work</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                <Beaker className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">1. Research</h3>
              <p className="text-sm text-slate-400">Conduct rigorous scientific investigation</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white">2. Document</h3>
              <p className="text-sm text-slate-400">Record methodology, data, and findings</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">3. Verify</h3>
              <p className="text-sm text-slate-400">Peer review and community validation</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-white">4. Archive</h3>
              <p className="text-sm text-slate-400">Permanent scientific truth record</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}