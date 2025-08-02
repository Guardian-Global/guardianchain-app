import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <motion.div
            initial={false}
            animate={
              theme === "dark"
                ? { rotate: 180, scale: 0 }
                : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
          <motion.div
            className="absolute"
            initial={false}
            animate={
              theme === "dark"
                ? { rotate: 0, scale: 1 }
                : { rotate: -90, scale: 0 }
            }
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <span className="mr-2 h-4 w-4">🖥️</span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
