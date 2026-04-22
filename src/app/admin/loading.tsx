import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-zinc-400">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        <p className="text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
