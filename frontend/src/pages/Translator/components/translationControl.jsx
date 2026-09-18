import React from 'react';

export function TranslationControls({
  isActive,
  isModelLoading,
  onToggle,
  onReset
}) {
  return (
    <div className="flex gap-3 w-[640px] justify-between items-center">
      <button
        onClick={onToggle}
        disabled={isModelLoading}
        className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
          isActive
            ? 'bg-rose-600 hover:bg-rose-500 text-white'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isModelLoading ? 'Loading Model...' : isActive ? 'Pause' : 'Start Translation'}
      </button>

      <button
        onClick={onReset}
        disabled={!isActive}
        className="px-4 py-2.5 rounded-lg font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
      >
        Reset Buffer
      </button>
    </div>
  );
}