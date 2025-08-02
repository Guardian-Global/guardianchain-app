import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { History, User, Clock, Eye, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface ReplayEntry {
  id: string;
  user: string;
  capsuleId: string;
  capsuleTitle: string;
  timestamp: string;
  action: "replay" | "verify" | "unlock";
  reputation?: number;
}

interface ReplayJournalProps {
  entries: ReplayEntry[];
}

export default function ReplayJournal({ entries }: ReplayJournalProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case "replay":
        return "bg-blue-600";
      case "verify":
        return "bg-green-600";
      case "unlock":
        return "bg-yellow-600";
      default:
        return "bg-slate-600";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "replay":
        return <History className="w-3 h-3" />;
      case "verify":
        return <Eye className="w-3 h-3" />;
      case "unlock":
        return <ExternalLink className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <History className="w-5 h-5 mr-2 text-blue-400" />
          Replay History
        </CardTitle>
      </CardHeader>

      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No replay activity yet</p>
            <p className="text-sm">Capsule interactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-slate-600 text-white text-xs">
                    {entry.user.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium text-sm">
                      {entry.user}
                    </span>
                    <Badge
                      className={`${getActionColor(entry.action)} text-white text-xs`}
                    >
                      {getActionIcon(entry.action)}
                      <span className="ml-1 capitalize">{entry.action}</span>
                    </Badge>
                    {entry.reputation && (
                      <Badge
                        variant="outline"
                        className="text-xs text-slate-400 border-slate-600"
                      >
                        Rep: {entry.reputation}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm">
                        <span className="text-slate-400">Capsule:</span>{" "}
                        <Link href={`/capsule/${entry.capsuleId}`}>
                          <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                            {entry.capsuleTitle}
                          </span>
                        </Link>
                      </p>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <Link href={`/capsule/${entry.capsuleId}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
