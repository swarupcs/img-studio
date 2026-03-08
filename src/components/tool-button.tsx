import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ToolButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
}) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "secondary" : "outline"}
          size="icon"
          onClick={onClick}
          className={cn(
            "w-full h-10 rounded-lg transition-all duration-200 cursor-pointer",
            active
              ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/25 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
              : "bg-zinc-900/30 text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 border-zinc-800/40",
          )}
          title={label}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
