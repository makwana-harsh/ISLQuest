import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/dashboard.api'; // Adjust relative path to dashboard.api.js

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await getDashboardStats();

      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to retrieve stats');
      }

      setStats(responseData.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      const errorMessage =
        err.response?.data?.message || err.message || 'Network error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Fetching platform statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-rose-950/40 border border-rose-800/60 rounded-xl text-center space-y-4">
          <h2 className="text-lg font-bold text-rose-400">Failed to Load Stats</h2>
          <p className="text-xs font-mono text-rose-300 break-words">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition"
          >
            Retry Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sanket Dashboard</h1>
          <p className="text-sm text-slate-400">Live platform metrics from MongoDB</p>
        </div>
        <button
          onClick={fetchStats}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md text-slate-300 border border-slate-700 transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dictionary Metric Card */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Dictionary Repository
          </span>
          <div className="text-4xl font-black text-white">
            {stats?.dictionary?.total?.toLocaleString() ?? 0}
          </div>
          <div className="text-xs text-slate-400 space-y-1 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Organization Certified:</span>
              <span className="font-semibold text-slate-200">
                {stats?.dictionary?.organizationVerified?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Community Contributed:</span>
              <span className="font-semibold text-slate-200">
                {stats?.dictionary?.communityContributed?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Learning Metric Card */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Learning Curriculum
          </span>
          <div className="text-4xl font-black text-white">
            {stats?.learning?.totalSigns?.toLocaleString() ?? 0}
          </div>
          <div className="text-xs text-slate-400 space-y-1 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Total Learning Signs:</span>
              <span className="font-semibold text-slate-200">
                {stats?.learning?.totalSigns?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Modules:</span>
              <span className="font-semibold text-slate-200">
                {stats?.learning?.modulesCount?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Community Metric Card */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Community Base
          </span>
          <div className="text-4xl font-black text-white">
            {stats?.community?.registeredUsers?.toLocaleString() ?? 0}
          </div>
          <div className="text-xs text-slate-400 space-y-1 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Active Members:</span>
              <span className="font-semibold text-slate-200">
                {stats?.community?.registeredUsers?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Account Status:</span>
              <span className="font-semibold text-emerald-400">Healthy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Payload Inspection */}
      {/* <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
        <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
          Raw Response Payload Inspection
        </span>
        <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg overflow-x-auto border border-slate-800">
          {JSON.stringify(stats, null, 2)}
        </pre>
      </div> */}
    </div>
  );
}