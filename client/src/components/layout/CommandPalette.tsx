import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  LayoutDashboard,
  FileText,
  Plus,
  TrendingUp,
  Users,
  Settings,
  Shield,
  Crown,
  Zap,
  Hash,
} from "lucide-react";

interface Command {
  id: string;
  label: string;
  description?: string;
  action: () => void;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  roles: string[];
  shortcut?: string;
}

const commands: Command[] = [
  {
    id: "dashboard",
    label: "Go to Dashboard",
    description: "View your main dashboard",
    action: () => (window.location.href = "/dashboard"),
    icon: LayoutDashboard,
    category: "Navigation",
    roles: ["guest", "member", "moderator", "admin", "dao-owner"],
    shortcut: "D",
  },
  {
    id: "admin",
    label: "Open Admin Panel",
    description: "Access administrative controls",
    action: () => (window.location.href = "/admin"),
    icon: Settings,
    category: "Navigation",
    roles: ["admin", "dao-owner"],
    shortcut: "A",
  },
  {
    id: "vault",
    label: "Browse Truth Vault",
    description: "Explore capsules and content",
    action: () => (window.location.href = "/vault"),
    icon: FileText,
    category: "Navigation",
    roles: ["guest", "member", "moderator", "admin", "dao-owner"],
    shortcut: "V",
  },
  {
    id: "create",
    label: "Create New Capsule",
    description: "Submit a truth capsule",
    action: () => (window.location.href = "/create"),
    icon: Plus,
    category: "Actions",
    roles: ["member", "moderator", "admin", "dao-owner"],
    shortcut: "C",
  },
  {
    id: "staking",
    label: "Access Staking",
    description: "Stake GTT tokens for yield",
    action: () => (window.location.href = "/staking"),
    icon: TrendingUp,
    category: "Finance",
    roles: ["member", "moderator", "admin", "dao-owner"],
    shortcut: "S",
  },
  {
    id: "dao",
    label: "DAO Governance",
    description: "Participate in governance decisions",
    action: () => (window.location.href = "/dao"),
    icon: Crown,
    category: "Governance",
    roles: ["dao-owner"],
    shortcut: "G",
  },
  {
    id: "validator",
    label: "Validator Dashboard",
    description: "Manage validation duties",
    action: () => (window.location.href = "/validator"),
    icon: Shield,
    category: "Moderation",
    roles: ["moderator", "admin", "dao-owner"],
    shortcut: "M",
  },
];

const tierHierarchy = {
  guest: 0,
  member: 1,
  moderator: 2,
  admin: 3,
  "dao-owner": 4,
};

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const currentTier = (user as any)?.tier?.toLowerCase() || "guest";
  const currentTierLevel =
    tierHierarchy[currentTier as keyof typeof tierHierarchy] ?? 0;

  // Filter commands based on user permissions and search
  const availableCommands = commands.filter((command) => {
    const hasPermission = command.roles.some((role) => {
      const roleLevel = tierHierarchy[role as keyof typeof tierHierarchy] ?? 0;
      return currentTierLevel >= roleLevel;
    });

    const matchesSearch =
      search === "" ||
      command.label.toLowerCase().includes(search.toLowerCase()) ||
      command.description?.toLowerCase().includes(search.toLowerCase()) ||
      command.category.toLowerCase().includes(search.toLowerCase());

    return hasPermission && matchesSearch;
  });

  // Group commands by category
  const groupedCommands = availableCommands.reduce(
    (acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    },
    {} as Record<string, Command[]>,
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open/close with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      // Close with Escape
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const executeCommand = (command: Command) => {
    command.action();
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      {/* Command palette trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 transition-colors group"
        title="Open command palette (⌘K)"
      >
        <Search className="h-5 w-5" />
        <span className="absolute -top-8 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          ⌘K
        </span>
      </button>

      {/* Command palette modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 bg-slate-800 border-slate-700">
          {/* Search header */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-700">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent text-white placeholder-slate-400 focus-visible:ring-0"
              autoFocus
            />
            <Badge variant="outline" className="text-xs">
              ESC
            </Badge>
          </div>

          {/* Commands list */}
          <div className="max-h-96 overflow-y-auto p-2">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Hash className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(
                ([category, categoryCommands]) => (
                  <div key={category} className="mb-4">
                    <div className="px-2 py-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {category}
                    </div>
                    <div className="space-y-1">
                      {categoryCommands.map((command) => {
                        const Icon = command.icon;
                        return (
                          <button
                            key={command.id}
                            onClick={() => executeCommand(command)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-700/50 rounded-lg transition-colors group"
                          >
                            <Icon className="h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white group-hover:text-blue-300">
                                {command.label}
                              </div>
                              {command.description && (
                                <div className="text-xs text-slate-400 truncate">
                                  {command.description}
                                </div>
                              )}
                            </div>
                            {command.shortcut && (
                              <Badge variant="outline" className="text-xs">
                                {command.shortcut}
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ),
              )
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-slate-700 text-xs text-slate-500">
            <span>Navigate with ↑↓, select with Enter</span>
            <span>Tier: {currentTier.toUpperCase()}</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommandPalette;
