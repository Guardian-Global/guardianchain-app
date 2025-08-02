import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Settings, Save, RefreshCw } from "lucide-react";

interface ConfigItem {
  key: string;
  value: string;
  type: "string" | "boolean" | "number";
  editable: boolean;
}

export default function AdminConfigView() {
  const [config, setConfig] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("GET", "/api/admin/config");
      const data = await response.json();
      setConfig(data.config || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleValueChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const saveConfig = async () => {
    if (Object.keys(editedValues).length === 0) return;

    try {
      setSaving(true);
      const response = await apiRequest("POST", "/api/admin/config", {
        updates: editedValues,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Configuration updated successfully",
        });
        setEditedValues({});
        await loadConfig();
      } else {
        throw new Error("Failed to save configuration");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getCurrentValue = (item: ConfigItem) => {
    return editedValues[item.key] !== undefined
      ? editedValues[item.key]
      : item.value;
  };

  const hasChanges = Object.keys(editedValues).length > 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Loading configuration...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Live Configuration Editor</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadConfig}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={saveConfig}
              disabled={!hasChanges || saving}
            >
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {config.map((item) => (
          <div key={item.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={item.key} className="text-sm font-medium">
                {item.key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
                {!item.editable && (
                  <Badge variant="secondary" className="text-xs">
                    Read Only
                  </Badge>
                )}
              </div>
            </div>

            {item.type === "boolean" ? (
              <select
                id={item.key}
                className="w-full p-2 border rounded-md"
                value={getCurrentValue(item)}
                onChange={(e) => handleValueChange(item.key, e.target.value)}
                disabled={!item.editable || saving}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <Input
                id={item.key}
                type={item.type === "number" ? "number" : "text"}
                value={getCurrentValue(item)}
                onChange={(e) => handleValueChange(item.key, e.target.value)}
                disabled={!item.editable || saving}
                className={
                  editedValues[item.key] !== undefined
                    ? "border-yellow-400"
                    : ""
                }
              />
            )}

            {editedValues[item.key] !== undefined && (
              <p className="text-xs text-yellow-600">
                Modified (original: {item.value})
              </p>
            )}
          </div>
        ))}

        {config.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No configuration items found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
