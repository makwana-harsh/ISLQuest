import React, { useState } from 'react';
import { awarenessData } from '../../assets/awarenessData';

export default function AwarenessPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { key: 'overview', label: 'What is ISL?' },
    { key: 'linguistics', label: 'History & Variations' },
    { key: 'standardization', label: 'ISLRTC & Standards' },
    { key: 'legal', label: 'RPwD Act & Policies' },
    { key: 'resources', label: 'Directories & Links' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Indian Sign Language Documentation & Awareness
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Linguistic foundation, historical milestones, policy protections, and verified national registries.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <div>
        {/* Section 1: What is ISL? */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Core Linguistic Definition
              </span>
              <p className="text-base text-slate-200 leading-relaxed">
                {awarenessData.overview.definition}
              </p>
            </div>

            <h2 className="text-lg font-bold text-white tracking-wide pt-2">
              Primary Linguistic Attributes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awarenessData.overview.linguisticFeatures.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1.5"
                >
                  <span className="text-sm font-semibold text-emerald-400">
                    {item.feature}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: History & Regional Variations */}
        {activeTab === 'linguistics' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Evolution & Documentation
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {awarenessData.historyAndVariations.historySummary}
              </p>
            </div>

            <h2 className="text-lg font-bold text-white tracking-wide pt-2">
              Major Regional Dialects & Variations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awarenessData.historyAndVariations.regionalDialects.map((d, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2"
                >
                  <h3 className="text-sm font-bold text-white">{d.region}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {d.characteristics}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Standardization & ISLRTC */}
        {activeTab === 'standardization' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Apex National Body
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {awarenessData.standardization.islrtcOverview}
              </p>
            </div>

            <h2 className="text-lg font-bold text-white tracking-wide pt-2">
              Standardization Milestones
            </h2>
            <div className="space-y-3">
              {awarenessData.standardization.keyMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-start gap-4"
                >
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-800/40">
                    {m.year}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">{m.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: RPwD Act & Policies */}
        {activeTab === 'legal' && (
          <div className="space-y-4 max-w-4xl">
            {awarenessData.legalFramework.map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{item.law}</h3>
                  <span className="text-[10px] font-mono uppercase bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded">
                    {item.focus}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Section 5: Directories & External Resources */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {awarenessData.directories.map((res, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-bold text-white">{res.name}</h3>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {res.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {res.description}
                  </p>
                </div>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  Visit Portal ↗
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}