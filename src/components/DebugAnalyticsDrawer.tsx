'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Database, RefreshCw, X, ChevronUp } from 'lucide-react';
import { FunnelEventPayload, getStoredClientEvents } from '@/lib/analytics';

interface DebugAnalyticsDrawerProps {
  currentVariant: 'fees' | 'alternatives';
  isUnlocked: boolean;
  onResetUnlock: () => void;
}

/**
 * DebugAnalyticsDrawer Component.
 * 
 * Production Security:
 * In production builds (NODE_ENV === 'production'), this component returns null unconditionally.
 * It is exclusively active in local development (NODE_ENV === 'development') to allow
 * local developers to inspect fired funnel events without opening external console tabs.
 */
export const DebugAnalyticsDrawer: React.FC<DebugAnalyticsDrawerProps> = ({
  currentVariant,
  onResetUnlock,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<FunnelEventPayload[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Strictly restricted to local development mode (NODE_ENV === 'development')
    // In production builds, this component returns null unconditionally.
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    setIsVisible(true);
    refreshData();

    const handleCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent<FunnelEventPayload>).detail;
      setEvents((prev) => [...prev, detail]);
    };

    window.addEventListener('etf_analytics_event', handleCustomEvent);
    return () => window.removeEventListener('etf_analytics_event', handleCustomEvent);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    setEvents(getStoredClientEvents());
    setIsRefreshing(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Pill Toggle (Dev Only) */}
      <div className="fixed bottom-3 right-3 z-50">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) refreshData();
          }}
          className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs flex items-center gap-2 shadow-xl cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>DEV AUDIT</span>
          <span className="text-[10px] bg-slate-800 px-1 text-slate-400">{events.length} ev.</span>
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-12 sm:right-3 sm:left-auto sm:w-[440px] max-h-[75vh] z-50 bg-slate-950 border border-slate-700 shadow-2xl flex flex-col font-mono text-xs text-slate-300 overflow-hidden">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white">INTERNÍ AUDIT (DEV)</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={refreshData}
                disabled={isRefreshing}
                className="p-1 hover:text-white"
                title="Obnovit"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between">
            <span>Varianta: <strong className="text-white uppercase">{currentVariant}</strong></span>
            <button
              type="button"
              onClick={onResetUnlock}
              className="px-2 py-0.5 border border-amber-700 text-amber-300 text-[10px]"
            >
              Resetovat zámek
            </button>
          </div>

          <div className="p-3 overflow-y-auto space-y-3 max-h-[50vh]">
            <div>
              <div className="text-white font-bold mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zaznamenané anonymní události ({events.length}):</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {events.slice().reverse().map((ev, i) => (
                  <div key={i} className="p-1.5 bg-slate-900/60 border border-slate-800/80 text-[10px]">
                    <span className="text-emerald-400 font-bold">{ev.event}</span>{' '}
                    <span className="text-slate-500">{new Date(ev.timestamp).toLocaleTimeString('cs-CZ')}</span>
                    {ev.details && <div className="text-slate-400 truncate">{JSON.stringify(ev.details)}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
