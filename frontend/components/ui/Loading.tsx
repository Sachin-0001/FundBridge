import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm font-medium">Loading...</p>
    </div>
  );
}
