import React from 'react';
import { toast } from 'sonner';
import { useAppBuilder } from './AppBuilderContext';
import FileUploadField from './FileUploadField';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

export default function StepUploads({ onNext, onBack }) {
  const { state, setField } = useAppBuilder();

  const handleClearCertificates = () => {
    toast.info('Certificates cleared from S3. New ones will be created on next build.');
  };

  const handleClearProvisioningProfiles = () => {
    toast.info('Provisioning profiles cleared from S3. New ones will be created on next build.');
  };

  return (
    <>
      <div className="space-y-8 pb-24">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            {state.mode === 'edit' ? 'Edit File Uploads' : 'File Uploads'}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Upload the required files for your app build.
          </p>
        </div>

        {/* App Icons */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">App Icons</h3>
          <div className="grid grid-cols-2 gap-4">
            <FileUploadField
              label="App Icon"
              accept=".png,.jpg,.jpeg"
              file={state.appIcon}
              onChange={file => setField('appIcon', file)}
              helperText="1024x1024 PNG recommended. Also used as splash icon."
              previewable
              tooltip="PNG, 1024 x 1024 px"
            />
            <FileUploadField
              label="Adaptive Icon"
              accept=".png,.jpg,.jpeg"
              file={state.adaptiveIcon}
              onChange={file => setField('adaptiveIcon', file)}
              helperText="1024x1024 PNG recommended. Used for Android adaptive icon."
              previewable
              showCropPreview
              tooltip="1024 x 1024 px. Place your logo/icon in the center 66% (safe zone ~676x676px). Leave the outer edges empty — they get clipped. Use a transparent background. Android requires adaptive icons for proper circular display."
            />
          </div>
        </div>

        {/* Apple .p8 Keys */}
        {state.iosDeployEnabled && (
          <>
            <hr className="border-zinc-200" />
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Apple Certificates</h3>
              <div className="grid grid-cols-2 gap-4">
                <FileUploadField
                  label="P8 API Key (.p8)"
                  accept=".p8"
                  file={state.appleApiKeyFile}
                  onChange={file => setField('appleApiKeyFile', file)}
                  helperText={`Upload to: ${state.appleTeamId}/p8_api_key.p8`}
                  tooltip="Source from App Store Connect"
                />
                <FileUploadField
                  label="P8 APN Key (.p8)"
                  accept=".p8"
                  file={state.appleApnKeyFile}
                  onChange={file => setField('appleApnKeyFile', file)}
                  helperText={`Upload to: ${state.appleTeamId}/p8_apn_key.p8`}
                  tooltip="Source from App Store Connect"
                />
              </div>

              {/* Clear Certificates & Provisioning Profiles */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleClearCertificates}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-300 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  <TrashIcon /> Clear Certificates
                </button>
                <button
                  onClick={handleClearProvisioningProfiles}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-300 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  <TrashIcon /> Clear Provisioning Profiles
                </button>
                <span className="text-[11px] text-zinc-400">Deletes cached certificates/profiles from S3. New ones are auto-created on next build.</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-10 py-4 flex items-center justify-between z-30">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
        >
          Continue to Review
        </button>
      </div>
    </>
  );
}
