import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight text-primary">FundBridge AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/borrow" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Borrow
          </Link>
          <Link href="/invest" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Invest
          </Link>
          <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Login
          </Link>
          {/* We'll add Shadcn Button here once we have it imported */}
        </div>
      </div>
    </nav>
  );
}
