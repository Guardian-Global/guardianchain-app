import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Mail, Globe } from "lucide-react";
import { generateComprehensivePressKit } from "@/utils/generatePressKit";
import { useToast } from "@/hooks/use-toast";

export default function PressKitGenerator() {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      const filename = generateComprehensivePressKit();

      toast({
        title: "Press Kit Generated",
        description: `${filename} downloaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <FileText className="w-5 h-5 mr-2 text-blue-400" />
          GUARDIANCHAIN Press Kit Generator
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Generate comprehensive press materials for media distribution
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Included Content:
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                Official launch announcement with tagline and description
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Complete feature overview and platform capabilities</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Mainnet launch features and technical specifications</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Founder quote and company vision statement</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Contact information and media resources</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Press Kit Details:</h4>
          <div className="space-y-1 text-sm text-slate-300">
            <p>
              <strong>Format:</strong> Professional PDF document
            </p>
            <p>
              <strong>Filename:</strong> GuardianChain_Launch_PressKit.pdf
            </p>
            <p>
              <strong>Content:</strong> 2-page comprehensive press release
            </p>
            <p>
              <strong>Contact:</strong> founder@guardianchain.app
            </p>
            <p>
              <strong>Website:</strong> https://guardianchain.app
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Press Kit PDF
          </Button>

          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 flex-1"
            onClick={() =>
              window.open(
                "mailto:founder@guardianchain.app?subject=Press%20Inquiry%20-%20GUARDIANCHAIN",
              )
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            Media Contact
          </Button>
        </div>

        <div className="text-center pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Professional press materials for journalists, investors, and media
            distribution
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
