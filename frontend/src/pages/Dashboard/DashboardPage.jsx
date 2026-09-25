import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDashboardStats } from "../../api/dashboard.api";
import IntroSplash from "./IntroSplash";

import "../../styles/Dashboard/DashboardPage.style.css";

const INTRO_KEY = "sanket:intro-seen";

// Adjust these paths if your router uses different URLs.
const QUICK_LINKS = [
  { to: "/learn", title: "Learn ISL", text: "Go through the modules and test yourself with quizzes.", tone: "teal" },
  { to: "/dictionary", title: "Dictionary", text: "Search for a sign and watch how it is made.", tone: "sky" },
  { to: "/translator", title: "Translator", text: "Sign in front of your camera and see the result live.", tone: "pink" },
  { to: "/contribute", title: "Contribute", text: "Record a sign that is missing and send it for review.", tone: "sun" },
  { to: "/awareness", title: "Awareness", text: "History, standards and your rights around ISL.", tone: "teal" },
];

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

function useCountUp(target, active, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    const end = Number(target) || 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (end === 0 || reduceMotion) {
      setValue(end);
      return undefined;
    }

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

const format = (n) => Number(n || 0).toLocaleString();

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [introDone, setIntroDone] = useState(hasSeenIntro);

  const handleIntroDone = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* storage unavailable, intro will simply replay next visit */
    }
    setIntroDone(true);
  }, []);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const responseData = await getDashboardStats();

      if (!responseData.success) {
        throw new Error(responseData.message || "Failed to retrieve stats");
      }

      setStats(responseData.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err.response?.data?.message || err.message || "Network error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const ready = introDone && !loading && Boolean(stats);

  const dictTotal = useCountUp(stats?.dictionary?.total, ready);
  const totalSigns = useCountUp(stats?.learning?.totalSigns, ready);
  const users = useCountUp(stats?.community?.registeredUsers, ready);

  const verified = Number(stats?.dictionary?.organizationVerified) || 0;
  const community = Number(stats?.dictionary?.communityContributed) || 0;
  const dictionaryTotal = Number(stats?.dictionary?.total) || 0;
  const verifiedPct = dictionaryTotal > 0 ? Math.round((verified / dictionaryTotal) * 100) : 0;

  const modules = Number(stats?.learning?.modulesCount) || 0;
  const signsPerModule = modules > 0 ? Math.round((Number(stats?.learning?.totalSigns) || 0) / modules) : 0;

  return (
    <div className="ui-scope ui-page db-page">
      {!introDone && <IntroSplash onDone={handleIntroDone} />}

      <div className={`ui-wrap db-wrap ${introDone ? "is-ready" : ""}`}>
        <header className="db-head db-reveal" style={{ "--i": 0 }}>
          <div>
            <h1>Welcome to ISLQuest</h1>
            <p>Here is where the dictionary, the lessons and the community stand today.</p>
          </div>

          <button
            type="button"
            className="ui-btn ui-btn--sm"
            onClick={() => fetchStats(true)}
            disabled={loading || refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh numbers"}
          </button>
        </header>

        {loading && (
          <div className="db-grid" aria-busy="true">
            <div className="ui-skel db-skel db-skel--tall" />
            <div className="ui-skel db-skel" />
            <div className="ui-skel db-skel" />
          </div>
        )}

        {!loading && error && !stats && (
          <div className="db-error ui-card" role="alert">
            <h2>We could not load the numbers</h2>
            <p>{error}</p>
            <button type="button" className="ui-btn ui-btn--primary" onClick={() => fetchStats()}>
              Try again
            </button>
          </div>
        )}

        {stats && (
          <>
            {error && <p className="ui-alert db-inline-error">{error}</p>}

            <section className="db-grid" aria-label="Platform statistics">
              <article className="db-card db-card--dict db-reveal" style={{ "--i": 1 }}>
                <h2>Dictionary</h2>
                <p className="db-big">{format(dictTotal)}</p>
                <p className="db-caption">signs are available to search and learn from.</p>

                <div className="db-split" role="img" aria-label={`${verifiedPct}% certified by organizations`}>
                  <span className="db-split-fill" style={{ width: `${ready ? verifiedPct : 0}%` }} />
                </div>

                <ul className="db-legend">
                  <li>
                    <i className="dot dot--teal" />
                    Certified by organizations <b>{format(verified)}</b>
                  </li>
                  <li>
                    <i className="dot dot--white" />
                    Added by the community <b>{format(community)}</b>
                  </li>
                </ul>
              </article>

              <article className="db-card db-card--learn db-reveal" style={{ "--i": 2 }}>
                <h2>Lessons</h2>
                <p className="db-num">{format(totalSigns)}</p>
                <p className="db-caption">
                  signs across {format(modules)} {modules === 1 ? "module" : "modules"}
                  {signsPerModule > 0 ? `, about ${signsPerModule} in each.` : "."}
                </p>
              </article>

              <article className="db-card db-card--people db-reveal" style={{ "--i": 3 }}>
                <h2>Community</h2>
                <p className="db-num">{format(users)}</p>
                <p className="db-caption">people have registered to learn and contribute.</p>
              </article>
            </section>
          </>
        )}

        <section className="db-next db-reveal" style={{ "--i": 4 }}>
          <h2>Where to next?</h2>

          <nav className="db-links" aria-label="Quick links">
            {QUICK_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className={`db-link tone-${link.tone}`}>
                <strong>{link.title}</strong>
                <span>{link.text}</span>
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </div>
  );
}
