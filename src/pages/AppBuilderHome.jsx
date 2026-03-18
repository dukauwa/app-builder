import React, { useState } from 'react';
import { toast } from 'sonner';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
);

const STATUS_STYLES = {
  success: 'bg-green-100 text-green-700',
  failed: 'bg-rose-100 text-rose-700',
  building: 'bg-[#522DA6]/10 text-[#522DA6]',
  pending: 'bg-zinc-100 text-zinc-500',
};

function StatusBadge({ status }) {
  if (!status) return <span className="text-xs text-zinc-400">—</span>;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
      {label}
    </span>
  );
}

function MetadataChip({ label, value }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 rounded-lg">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xs font-mono font-medium text-zinc-700">{value}</span>
    </div>
  );
}

function formatDuration(ms) {
  if (!ms) return '—';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function AppBuilderHome({ navigate, build = null, appData = {} }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Build status refreshed');
    }, 1500);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">App Builder</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your native app builds for iOS and Android</p>
        </div>
        <div className="flex items-center gap-2">
          {build && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2.5 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              <span className={refreshing ? 'animate-spin' : ''}><RefreshIcon /></span>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
          <button
            onClick={() => navigate?.('#/app-builder/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
          >
            <PlusIcon />
            {build ? 'New Version' : 'Create App Build'}
          </button>
        </div>
      </div>

      {!build ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 border border-zinc-200 rounded-xl bg-zinc-50/50">
          <PhoneIcon />
          <h2 className="text-base font-semibold text-zinc-900 mt-4">No builds yet</h2>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm text-center">
            Create your first app build to push to TestFlight and App Tester for internal testing.
          </p>
          <button
            onClick={() => navigate?.('#/app-builder/new')}
            className="mt-4 px-4 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
          >
            Create App Build
          </button>
        </div>
      ) : (
        <>
          {/* App Identity Card */}
          <div className="border border-zinc-200 rounded-xl p-5 mb-6 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">{build.config?.appName || appData.appName}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <MetadataChip label="Bundle ID" value={build.config?.bundleId || appData.bundleId} />
                  <MetadataChip label="Package ID" value={build.config?.packageId || appData.packageId} />
                  <MetadataChip label="Apple Team ID" value={build.config?.appleTeamId || appData.appleTeamId} />
                  {(build.appleStoreConnectId || appData.appleStoreConnectId) && (
                    <MetadataChip label="App Store ID" value={build.appleStoreConnectId || appData.appleStoreConnectId} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Build Details Table */}
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-700">Latest Build</h3>
              <button
                onClick={() => navigate?.('#/app-builder/edit')}
                className="flex items-center gap-1.5 text-xs font-medium text-[#522DA6] hover:underline"
              >
                <EditIcon /> Edit
              </button>
            </div>

            {/* Two-column layout: iOS and Android side by side */}
            <div className="grid grid-cols-2 divide-x divide-zinc-200">
              {/* iOS Column */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-700"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-800">iOS</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Build Status</span>
                    <StatusBadge status={build.iosBuildStatus} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Version</span>
                    <span className="text-xs font-mono font-medium text-zinc-700">{build.iosVersion || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Build Duration</span>
                    <span className="text-xs font-mono text-zinc-600">{formatDuration(build.iosBuildDuration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Published</span>
                    <span className={`text-xs font-medium ${build.iosPublished ? 'text-green-600' : 'text-zinc-400'}`}>
                      {build.iosPublished ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Created</span>
                    <span className="text-xs text-zinc-600">{build.iosCreatedAt || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Android Column */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-600"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86-.31-.16-.69-.04-.86.27l-1.86 3.22c-1.35-.6-2.85-.95-4.45-.95s-3.1.35-4.45.95L5.69 5.71c-.16-.31-.54-.43-.86-.27-.31.16-.43.55-.27.86L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-800">Android</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Build Status</span>
                    <StatusBadge status={build.androidBuildStatus} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Version</span>
                    <span className="text-xs font-mono font-medium text-zinc-700">{build.androidVersion || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Build Duration</span>
                    <span className="text-xs font-mono text-zinc-600">{formatDuration(build.androidBuildDuration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Published</span>
                    <span className={`text-xs font-medium ${build.androidPublished ? 'text-green-600' : 'text-zinc-400'}`}>
                      {build.androidPublished ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Created</span>
                    <span className="text-xs text-zinc-600">{build.androidCreatedAt || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
