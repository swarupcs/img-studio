import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface GridItemProps {
  icon?: LucideIcon;
  image?: string;
  label: string;
  desc?: string;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

const GridItem = ({
  icon: Icon,
  image,
  label,
  desc,
  onClick,
  disabled,
  isActive = false,
}: GridItemProps) => {
  // 1. IMAGE MODE
  if (image) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={onClick}
              disabled={disabled}
              className={cn(
                "relative h-[4.5rem] w-full p-0 overflow-hidden rounded-lg border transition-all",
                "bg-zinc-950 border-zinc-800/40",
                "hover:border-purple-500/50 hover:opacity-100",
                disabled
                  ? "cursor-not-allowed opacity-30"
                  : "cursor-pointer opacity-75",
                isActive
                  ? "border-purple-500 ring-1 ring-purple-500/40 opacity-100"
                  : "",
              )}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                style={{ backgroundImage: `url(${image})` }}
              />
              {/* Label overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                <span className="text-[9px] font-medium text-zinc-200">
                  {label}
                </span>
              </div>
            </Button>
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            sideOffset={8}
            className={cn(
              "bg-zinc-950 border border-zinc-800 text-zinc-200",
              "shadow-xl rounded-lg px-3",
              "max-w-50 wrap-break-word z-50",
              "animate-in fade-in-0 zoom-in-95",
            )}
            align="center"
          >
            <p className="font-bold text-xs text-zinc-100">{label}</p>
            {desc && (
              <p className="text-[10px] text-zinc-400 mt-1 leading-snug">
                {desc}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // 2. ICON MODE
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1.5 p-2.5 h-[4.5rem] w-full rounded-lg border transition-all group",
        "bg-zinc-900/30 border-zinc-800/40",
        "hover:border-purple-500/40 hover:bg-zinc-900/60",
        disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer",
        isActive ? "border-purple-500 bg-purple-500/10" : "",
      )}
    >
      {Icon && (
        <Icon
          size={18}
          className={cn(
            "transition-colors",
            isActive
              ? "text-purple-400"
              : "text-zinc-500 group-hover:text-purple-400",
          )}
        />
      )}
      <div className="text-center w-full">
        <span
          className={cn(
            "block text-[9px] font-medium transition-colors",
            isActive
              ? "text-zinc-200"
              : "text-zinc-500 group-hover:text-zinc-300",
          )}
        >
          {label}
        </span>
        {desc && (
          <span className="block text-[8px] text-zinc-600 group-hover:text-zinc-500 transition-colors mt-0.5 truncate w-full">
            {desc}
          </span>
        )}
      </div>
    </Button>
  );
};

export default GridItem;
