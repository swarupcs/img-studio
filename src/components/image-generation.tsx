import { Loader2, Sparkles } from "lucide-react";

function ImageGenerationLoading() {
  return (
    <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-purple-500/20 animate-ping" />

        {/* Spinner container */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
        </div>
      </div>

      <div className="mt-6 text-center space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple-400" />
          <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">
            Generating
          </h2>
        </div>
        <p className="text-zinc-500 text-xs">Applying AI magic to your image</p>
      </div>

      {/* Animated shimmer bar */}
      <div className="mt-6 w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-gradient-to-r from-purple-600 to-violet-500 rounded-full animate-shimmer" />
      </div>
    </div>
  );
}

export default ImageGenerationLoading;
