import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
  BookOpen,
  BarChart3,
  Clock,
  Layers,
  Timer,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  FolderArchive,
  Compass
} from 'lucide-react';
import { DashboardView } from './types';
import ThemeToggle from '../ThemeToggle';
import AppIcon from '../AppIcon';

interface SidebarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  user: User;
  onLogout: () => void;
  onOpenProfileSettings: () => void;
  onOpenInfoModal: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: DashboardView;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    id: 'studio',
    label: 'New exam',
    icon: BookOpen,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    badge: 'Live',
    icon: BarChart3,
  },
  {
    id: 'history',
    label: 'History & Files',
    icon: FolderArchive,
  },
];

const SUGGESTED_NAV_ITEMS: NavItem[] = [
  {
    id: 'library',
    label: 'Knowledge Vault',
    icon: Layers,
  },
  {
    id: 'focus',
    label: 'Focus Room',
    icon: Timer,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  user,
  onLogout,
  onOpenProfileSettings,
  onOpenInfoModal,
  collapsed,
  onToggleCollapse,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const rawUserName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner';
  const nameParts = rawUserName.trim().split(/\s+/);
  const displayName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1][0].toUpperCase()}.` : nameParts[0];
  const avatarUrl = `https://api.dicebear.com/10.x/triangles/svg?seed=${encodeURIComponent(rawUserName)}`;

  return (
    <aside
      className={`relative h-full flex flex-col justify-between bg-surface-1/95 border-r border-border transition-all duration-300 ease-spring select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Dashboard navigation"
    >
      {/* Top Header & Brand */}
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <AppIcon className="size-9 rounded-full shrink-0" />
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span
                  className="font-['Preospe'] text-lg font-bold tracking-tight text-text-1 truncate"
                  style={{ fontFamily: "'Preospe', sans-serif" }}
                >
                  Somma
                </span>
                <span className="text-[11px] text-text-3 uppercase tracking-wider font-mono">
                  Study Partner
                </span>
              </div>
            )}
          </div>

          {/* Collapse/Expand Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-none text-text-2 hover:text-text-1 hover:bg-surface-2 border border-transparent hover:border-border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>

        {/* Primary Navigation Section */}
        <div className="flex flex-col gap-1 mt-2">
          {!collapsed && (
            <span className="px-2 pb-1 text-[10px] font-mono tracking-widest text-text-3 uppercase">
              Study Suite
            </span>
          )}

          {PRIMARY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  type="button"
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none border ${
                    isActive
                      ? 'bg-white text-black border-white shadow-sm font-semibold'
                      : 'text-text-2 hover:text-text-1 hover:bg-surface-2/70 border-transparent hover:border-border'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-none uppercase ${
                        isActive
                          ? 'bg-black text-white'
                          : 'bg-surface-3 text-text-2 border border-border'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Collapsed Tooltip */}
                {collapsed && hoveredItem === item.id && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 bg-surface-1 border border-border text-text-1 text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Suggested Spaces Navigation Section */}
        <div className="flex flex-col gap-1 mt-3">
          {!collapsed && (
            <span className="px-2 pb-1 text-[10px] font-mono tracking-widest text-text-3 uppercase">
              Spaces
            </span>
          )}

          {SUGGESTED_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  type="button"
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none border ${
                    isActive
                      ? 'bg-white text-black border-white shadow-sm font-semibold'
                      : 'text-text-2 hover:text-text-1 hover:bg-surface-2/70 border-transparent hover:border-border'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                </button>

                {/* Collapsed Tooltip */}
                {collapsed && hoveredItem === item.id && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 bg-surface-1 border border-border text-text-1 text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom User & Controls Section */}
      <div className="flex flex-col gap-2 p-3 border-t border-border bg-surface-1">
        {/* Quick Utility Row */}
        <div className={`flex items-center gap-1 ${collapsed ? 'flex-col' : 'justify-between'}`}>
          <ThemeToggle />

          <button
            type="button"
            onClick={onOpenInfoModal}
            className="p-2 text-text-2 hover:text-text-1 hover:bg-surface-2 border border-transparent hover:border-border transition-colors duration-150 rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            title="Help & FAQ"
            aria-label="Help & FAQ"
          >
            <HelpCircle className="size-4" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-text-2 hover:text-text-1 hover:bg-surface-2 border border-transparent hover:border-border transition-colors duration-150 rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </button>
        </div>

        {/* User Profile Pill */}
        <button
          type="button"
          onClick={onOpenProfileSettings}
          className={`flex items-center gap-3 p-2 text-left bg-surface-2/40 hover:bg-surface-2 border border-border transition-all duration-150 rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Account settings"
        >
          <img
            src={avatarUrl}
            alt={displayName}
            className="size-8 rounded-none border border-border bg-surface-3 object-cover shrink-0"
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-text-1 truncate">{displayName}</span>
              <span className="text-[10px] text-text-3 font-mono truncate">{user.email}</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
