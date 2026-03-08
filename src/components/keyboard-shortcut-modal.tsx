"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

const SHORTCUTS = [
  {
    category: "Tools",
    items: [
      { keys: ["M"], action: "Pan / Move" },
      { keys: ["B"], action: "Brush" },
      { keys: ["E"], action: "Eraser" },
      { keys: ["C"], action: "Crop" },
      { keys: ["T"], action: "Text" },
      { keys: ["P"], action: "Color picker" },
      { keys: ["W"], action: "Smart remove" },
      { keys: ["Esc"], action: "Return to Move tool" },
    ],
  },
  {
    category: "History",
    items: [
      { keys: ["Ctrl", "Z"], action: "Undo" },
      { keys: ["Ctrl", "Y"], action: "Redo" },
    ],
  },
  {
    category: "Brush",
    items: [
      { keys: ["["], action: "Decrease brush size" },
      { keys: ["]"], action: "Increase brush size" },
    ],
  },
  {
    category: "Canvas",
    items: [
      { keys: ["Space", "+drag"], action: "Pan canvas" },
      { keys: ["Scroll"], action: "Zoom in / out" },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function KeyboardShortcutModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <Keyboard size={15} className="text-purple-400" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          {SHORTCUTS.map((section) => (
            <div key={section.category}>
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                {section.category}
              </h3>
              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <div
                    key={item.action}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-zinc-300">{item.action}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-300"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
