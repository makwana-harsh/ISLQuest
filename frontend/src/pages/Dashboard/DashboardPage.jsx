import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/dashboard.api';

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-12 max-w-6xl mx-auto">
      {/* 1. Welcoming Hero Banner */}
      <div className="space-y-4 border-b border-slate-800/80 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 border border-indigo-800/60 text-indigo-300">
          <span>🇮🇳</span> Making Indian Sign Language Accessible Everywhere
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
          Welcome to <span className="text-indigo-400">Sanket</span>
        </h1>
        <p className="text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed">
          Sanket is an open platform designed to bridge the communication gap between India's 
          Deaf community and hearing society. Learn signs, test your knowledge, or translate your hand movements in real time using everyday technology.
        </p>
      </div>

      {/* 2. Live Community & Learning Numbers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Platform at a Glance</h2>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-indigo-400 transition"
          >
            {loading ? 'Updating...' : '↻ Refresh counts'}
          </button>
        </div>

        {error ? (
          <div className="p-4 bg-rose-950/30 border border-rose-800/60 rounded-xl text-xs text-rose-300">
            Could not fetch live numbers: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-semibold uppercase text-indigo-400">Words in Library</span>
              <div className="text-3xl font-black text-white">
                {loading ? '...' : stats?.dictionary?.total?.toLocaleString() ?? 0}
              </div>
              <p className="text-xs text-slate-400">
                Certified ISL gestures available in our searchable video dictionary.
              </p>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-semibold uppercase text-emerald-400">Interactive Lessons</span>
              <div className="text-3xl font-black text-white">
                {loading ? '...' : stats?.learning?.totalSigns?.toLocaleString() ?? 0}
              </div>
              <p className="text-xs text-slate-400">
                Bite-sized practice signs across common daily conversations.
              </p>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-semibold uppercase text-amber-400">Community Members</span>
              <div className="text-3xl font-black text-white">
                {loading ? '...' : stats?.community?.registeredUsers?.toLocaleString() ?? 0}
              </div>
              <p className="text-xs text-slate-400">
                Learners, educators, and deaf advocates building this network together.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. The "Why This Matters" Story */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl space-y-4">
        <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <span>💡</span> The Reality Behind Indian Sign Language
        </h3>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed">
          India has an estimated <strong className="text-white">18 million deaf and hard-of-hearing citizens</strong>, 
          making it home to one of the largest signing communities in the world. Yet, certified interpreters are scarce, 
          and everyday services—like hospitals, banks, and public transit—rarely offer accessible communication.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Sanket was created to make learning sign language as natural as learning any spoken language, 
          giving families, colleagues, and friends the tools to communicate without barriers.
        </p>
      </div>

      {/* 4. How the Magic Works (Plain-English AI Explanation) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            How Does the AI Translator Actually Work?
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            You don't need a special sensory glove or a costly camera. Here is how your laptop or phone understands your signs:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="text-2xl">📷</div>
            <h4 className="text-sm font-bold text-white">1. Sees the Motion, Not You</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When you stand in front of your camera, the system detects a simple <strong className="text-slate-200">digital skeleton</strong> of your hands, fingers, and shoulders. It tracks where your fingers bend—not your face, background, or personal appearance.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="text-2xl">🔒</div>
            <h4 className="text-sm font-bold text-white">2. 100% Private & Safe</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your video <strong className="text-slate-200">never leaves your device</strong>. No video is recorded, saved, or uploaded to any server. Everything is calculated right inside your web browser.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="text-2xl">🗣️</div>
            <h4 className="text-sm font-bold text-white">3. Turns Signs Into Voice</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once the computer recognizes the shape and rhythm of the sign, it displays the meaning instantly on the screen and can even speak it aloud so anyone nearby can hear.
            </p>
          </div>
        </div>
      </div>

      {/* 5. What Can You Do on Sanket? (Feature Guide for Beginners) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Explore the Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <h4 className="text-sm font-bold text-white">Search the Sign Dictionary</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Forgot how to sign "Thank you" or "Doctor"? Look up everyday words and watch slow, clear video demonstrations recorded by native signers.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <h4 className="text-sm font-bold text-white">Learn Step-by-Step</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Start with the alphabet, numbers, and basic greetings. Interactive quizzes help you check your memory as you progress.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h4 className="text-sm font-bold text-white">Real-Time Sign Translator</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn on your webcam and practice signing directly to the screen. The AI gives you immediate feedback when your handshapes match.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤝</span>
              <h4 className="text-sm font-bold text-white">Community Contributions</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign languages have regional variations across Delhi, Mumbai, Bengaluru, and Kolkata. Native signers can submit local signs for review.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Closing Call to Action */}
      <div className="p-6 bg-slate-900/50 border border-slate-800 text-center rounded-2xl space-y-3">
        <h3 className="text-base font-bold text-white">Ready to begin your journey?</h3>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
          Start by browsing the <strong className="text-slate-300">Learn ISL</strong> module for your first lesson, 
          or head over to the <strong className="text-slate-300">Awareness</strong> section to understand deaf culture and communication etiquette.
        </p>
      </div>
    </div>
  );
}