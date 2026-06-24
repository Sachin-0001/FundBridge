import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-[#0A0A0A] py-8 mt-auto z-10 relative">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Shield className="w-5 h-5 text-blue-500" />
          <p className="text-sm font-medium text-zinc-400">
            © {new Date().getFullYear()} FundBridge AI. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-sm font-medium text-zinc-500">
          <Link href="/terms" className="cursor-pointer hover:text-blue-400 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="cursor-pointer hover:text-emerald-400 transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="cursor-pointer hover:text-indigo-400 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
