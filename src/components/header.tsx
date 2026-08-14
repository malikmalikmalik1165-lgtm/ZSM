"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Menu, LogOut, Loader2 } from "@/components/icons";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, loading, signOut, isConfigured } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {!isConfigured && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            Demo Mode
          </span>
        )}
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:block">
              {user.email}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : isConfigured ? (
          <a
            href="/login"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Sign In
          </a>
        ) : null}
      </div>
    </header>
  );
}
