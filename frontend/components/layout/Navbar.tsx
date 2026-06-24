"use client";

import Link from 'next/link';
import { useState } from 'react';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const homeHref = isAuthenticated && user
  ? `/dashboard/${user.role.toLowerCase()}`
  : "/";
  const getInitials = () => {
    if (user?.role === "BUSINESS" && user?.profile?.company_name) {
      return user.profile.company_name.substring(0, 2).toUpperCase();
    }
    if (user?.role === "BANK" && user?.profile?.institution_name) {
      return user.profile.institution_name.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'US';
  };

  const getProfileName = () => {
    if (user?.role === "BUSINESS" && user?.profile?.company_name) {
      return user.profile.company_name;
    }
    if (user?.role === "BANK" && user?.profile?.institution_name) {
      return user.profile.institution_name;
    }
    return user?.role === 'BANK' ? 'Bank Partner' : 'User';
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href={homeHref} className="cursor-pointer flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight text-primary">FundBridge</span>
        </Link>
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-16 h-8 bg-muted rounded-md hidden sm:block"></div>
              <div className="w-24 h-9 bg-muted rounded-lg"></div>
            </div>
          ) : isAuthenticated && user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 hover:bg-muted px-2 py-1.5 rounded-lg transition-colors border border-transparent hover:border-border/50 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {getInitials()}
                </div>
                <div className="flex flex-col items-start hidden sm:flex">
                  <span className="text-sm font-medium leading-none mb-1">{getProfileName()}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg py-1 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <Link 
                      href={`/dashboard/${user.role.toLowerCase()}`} 
                      className="cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button 
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Login
              </Link>
              <Link href="/register?type=business" className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
