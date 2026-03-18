import React from 'react';
import { AppBuilderProvider, useAppBuilder } from '../components/app-builder/AppBuilderContext';
import StepConfig from '../components/app-builder/StepConfig';
import StepUploads from '../components/app-builder/StepUploads';
import StepReview from '../components/app-builder/StepReview';

// ── Icons ──
const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

// ── Step Indicator ──
const STEPS = [
  { id: 'config', label: 'Configuration' },
  { id: 'uploads', label: 'File Uploads' },
  { id: 'review', label: 'Review & Build' },
];

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <span className={`font-medium ${s.id === current ? 'text-[#522DA6]' : i < steps.findIndex(x => x.id === current) ? 'text-zinc-900' : ''}`}>
            {s.label}
          </span>
          {i < steps.length - 1 && <span className="text-zinc-300">{'>'}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// Helper to auto-increment a semver patch version
function incrementPatch(version) {
  if (!version) return '1.0.0';
  const parts = version.split('.');
  if (parts.length !== 3) return version;
  parts[2] = String(Number(parts[2]) + 1);
  return parts.join('.');
}

// ── Inner Flow (needs context) ──
function AppBuilderInner({ navigate, onBuildUpdated }) {
  const { state, setStep } = useAppBuilder();
  const goBack = () => navigate('#/');
  const isEdit = state.mode === 'edit';

  return (
    <div className="min-h-screen bg-white">
      {/* Purple top bar */}
      <div className="h-1 bg-[#522DA6]" />

      {/* Sticky header */}
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/Image (Grip).png" alt="Grip" className="h-7" />
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">App Builder</h1>
            <StepIndicator steps={STEPS} current={state.currentStep} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEdit && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              Editing Build
            </span>
          )}
          {!isEdit && state.versionNumber && (
            <span className="px-2.5 py-1 bg-[#522DA6]/10 text-[#522DA6] rounded-full text-xs font-medium">
              New Version: v{state.versionNumber}
            </span>
          )}
          <button onClick={goBack} className="flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <ArrowLeft /> Go back
          </button>
        </div>
      </div>

      {/* Step Content */}
      <div className="py-8 px-10">
        {state.currentStep === 'config' && (
          <StepConfig
            onNext={() => setStep('uploads')}
            onCancel={goBack}
          />
        )}
        {state.currentStep === 'uploads' && (
          <StepUploads
            onNext={() => setStep('review')}
            onBack={() => setStep('config')}
          />
        )}
        {state.currentStep === 'review' && (
          <StepReview
            onBack={() => setStep('uploads')}
            onGoToStep={(step) => setStep(step)}
            onBuildUpdated={onBuildUpdated}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}

// ── Flow Container (provides context) ──
export default function AppBuilderFlow({ navigate, currentPath, build = null, appData = {}, onBuildUpdated }) {
  const pathParts = currentPath.replace('/app-builder', '').split('/').filter(Boolean);
  const action = pathParts[0] || 'new'; // 'new' or 'edit'

  let initialData;

  if (action === 'edit' && build) {
    // Edit mode — load existing build config, identity fields locked
    initialData = {
      ...build.config,
      mode: 'edit',
      versionNumber: build.versionNumber,
      iosVersion: build.iosVersion,
      androidVersion: build.androidVersion,
      appleStoreConnectId: build.appleStoreConnectId || appData.appleStoreConnectId,
      lockedFields: ['bundleId', 'packageId', 'appleTeamId'],
      step1Saved: true,
    };
  } else {
    // New version — prefill from existing build config if available
    if (build) {
      initialData = {
        ...build.config,
        mode: 'new-version',
        versionNumber: build.versionNumber + 1,
        iosVersion: incrementPatch(build.iosVersion),
        androidVersion: incrementPatch(build.androidVersion),
        appleStoreConnectId: build.appleStoreConnectId || appData.appleStoreConnectId,
        lockedFields: ['bundleId', 'packageId', 'appleTeamId'],
        step1Saved: true,
      };
    } else {
      // First ever build
      initialData = {
        mode: 'new-version',
        versionNumber: 1,
        iosVersion: '1.0.0',
        androidVersion: '1.0.0',
      };
    }
  }

  return (
    <AppBuilderProvider initialData={initialData}>
      <AppBuilderInner navigate={navigate} onBuildUpdated={onBuildUpdated} />
    </AppBuilderProvider>
  );
}
