import React from 'react';

export function PredictionDisplay({ predictionState }) {
  const { status, sign, confidence, progress, total } = predictionState;

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl w-[640px] flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
          Detection Status
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300">
          {status}
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <h2 className="text-3xl font-extrabold text-white capitalize">
          {sign ? sign.replace('_', ' ') : '—'}
        </h2>
        {confidence > 0 && (
          <span className="text-sm font-semibold text-emerald-400">
            {Math.round(confidence * 100)}% Match
          </span>
        )}
      </div>

      {status === 'buffering' && (
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
          <div
            className="bg-indigo-500 h-full transition-all duration-75"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}