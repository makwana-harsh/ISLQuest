import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../api/dashboard.api";
import IntroSplash from "./IntroSplash";
import "../../styles/Dashboard/DashboardPage.style.css";

const INTRO_KEY = "ISLQuest:intro-seen";

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
  const verifiedPct =
    dictionaryTotal > 0 ? Math.round((verified / dictionaryTotal) * 100) : 0;

  const modules = Number(stats?.learning?.modulesCount) || 0;
  const signsPerModule =
    modules > 0
      ? Math.round((Number(stats?.learning?.totalSigns) || 0) / modules)
      : 0;

  return (
    <div className="ui-scope ui-page db-page">
      {!introDone && <IntroSplash onDone={handleIntroDone} />}

      <div className={`ui-wrap db-wrap ${introDone ? "is-ready" : ""}`}>
        <header className="db-head db-reveal" style={{ "--i": 0 }}>
          <div>
            <p className="db-eyebrow">🇮🇳 Indian Sign Language</p>
            <h1>Welcome to ISLQuest</h1>
            <p>
              ISLQuest is an open platform designed to bridge the communication
              gap between India's Deaf community and hearing society.
            </p>
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

        <section className="db-intro db-reveal" style={{ "--i": 1 }}>
          <span className="db-intro-badge">Making Indian Sign Language Accessible Everywhere</span>
          <p>
            Learn signs, test your knowledge, or translate your hand movements
            in real time using everyday technology.
          </p>
        </section>

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
            <button
              type="button"
              className="ui-btn ui-btn--primary"
              onClick={() => fetchStats()}
            >
              Try again
            </button>
          </div>
        )}

        {stats && (
          <>
            {error && <p className="ui-alert db-inline-error">{error}</p>}

            <section className="db-grid" aria-label="Platform statistics">
              <article className="db-card db-card--dict db-reveal" style={{ "--i": 2 }}>
                <span className="db-card-icon">📖</span>
                <h2>Words in Library</h2>
                <p className="db-big">{format(dictTotal)}</p>
                <p className="db-caption">
                  Certified ISL gestures available in our searchable video dictionary.
                </p>

                <div
                  className="db-split"
                  role="img"
                  aria-label={`${verifiedPct}% certified by organizations`}
                >
                  <span
                    className="db-split-fill"
                    style={{ width: `${ready ? verifiedPct : 0}%` }}
                  />
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

              <article className="db-card db-card--learn db-reveal" style={{ "--i": 3 }}>
                <span className="db-card-icon">🎯</span>
                <h2>Interactive Lessons</h2>
                <p className="db-num">{format(totalSigns)}</p>
                <p className="db-caption">
                  Bite-sized practice signs across common daily conversations.
                  {modules > 0 && (
                    <>
                      {" "}
                      {format(modules)} {modules === 1 ? "module" : "modules"}
                      {signsPerModule > 0
                        ? `, about ${format(signsPerModule)} in each.`
                        : "."}
                    </>
                  )}
                </p>
              </article>

              <article className="db-card db-card--people db-reveal" style={{ "--i": 4 }}>
                <span className="db-card-icon">🤝</span>
                <h2>Community Members</h2>
                <p className="db-num">{format(users)}</p>
                <p className="db-caption">
                  Learners, educators, and deaf advocates building this network together.
                </p>
              </article>
            </section>
          </>
        )}

        <section className="db-story db-reveal" style={{ "--i": 5 }}>
          <div className="db-section-heading">
            <span>💡</span>
            <div>
              <p className="db-kicker">Why this matters</p>
              <h2>The Reality Behind Indian Sign Language</h2>
            </div>
          </div>

          <p>
            India has an estimated{" "}
            <strong>18 million deaf and hard-of-hearing citizens</strong>,
            making it home to one of the largest signing communities in the world.
            Yet, certified interpreters are scarce, and everyday services—like
            hospitals, banks, and public transit—rarely offer accessible communication.
          </p>

          <p className="db-muted">
            ISLQuest was created to make learning sign language as natural as learning
            any spoken language, giving families, colleagues, and friends the tools
            to communicate without barriers.
          </p>
        </section>

        <section className="db-section db-reveal" style={{ "--i": 6 }}>
          <div className="db-section-heading">
            <span>✨</span>
            <div>
              <p className="db-kicker">Behind the technology</p>
              <h2>How Does the AI Translator Actually Work?</h2>
              <p>
                You don't need a special sensory glove or a costly camera. Here is
                how your laptop or phone understands your signs:
              </p>
            </div>
          </div>

          <div className="db-feature-grid">
            <article className="db-feature-card">
              <span>📷</span>
              <h3>1. Sees the Motion, Not You</h3>
              <p>
                When you stand in front of your camera, the system detects a simple
                <strong> digital skeleton</strong> of your hands, fingers, and
                shoulders. It tracks where your fingers bend—not your face,
                background, or personal appearance.
              </p>
            </article>

            <article className="db-feature-card">
              <span>🔒</span>
              <h3>2. 100% Private & Safe</h3>
              <p>
                Your video <strong>never leaves your device</strong>. No video is
                recorded, saved, or uploaded to any server. Everything is calculated
                right inside your web browser.
              </p>
            </article>

            <article className="db-feature-card">
              <span>🗣️</span>
              <h3>3. Turns Signs Into Voice</h3>
              <p>
                Once the computer recognizes the shape and rhythm of the sign, it
                displays the meaning instantly on the screen and can even speak it
                aloud so anyone nearby can hear.
              </p>
            </article>
          </div>
        </section>

        <section className="db-section db-reveal" style={{ "--i": 7 }}>
          <div className="db-section-heading">
            <span>🚀</span>
            <div>
              <p className="db-kicker">Explore ISLQuest</p>
              <h2>What Can You Do on ISLQuest?</h2>
              <p>Everything you need to start learning and communicating with ISL.</p>
            </div>
          </div>

          <div className="db-feature-grid db-feature-grid--two">
            <article className="db-feature-card">
              <span>📖</span>
              <h3>Search the Sign Dictionary</h3>
              <p>
                Forgot how to sign "Thank you" or "Doctor"? Look up everyday words
                and watch slow, clear video demonstrations recorded by native signers.
              </p>
            </article>

            <article className="db-feature-card">
              <span>🎯</span>
              <h3>Learn Step-by-Step</h3>
              <p>
                Start with the alphabet, numbers, and basic greetings. Interactive
                quizzes help you check your memory as you progress.
              </p>
            </article>

            <article className="db-feature-card">
              <span>⚡</span>
              <h3>Real-Time Sign Translator</h3>
              <p>
                Turn on your webcam and practice signing directly to the screen.
                The AI gives you immediate feedback when your handshapes match.
              </p>
            </article>

            <article className="db-feature-card">
              <span>🤝</span>
              <h3>Community Contributions</h3>
              <p>
                Sign languages have regional variations across Delhi, Mumbai,
                Bengaluru, and Kolkata. Native signers can submit local signs for review.
              </p>
            </article>
          </div>
        </section>

        <section className="db-cta db-reveal" style={{ "--i": 8 }}>
          <p className="db-kicker">Start exploring</p>
          <h2>Ready to begin your journey?</h2>
          <p>
            Start by browsing the <strong>Learn ISL</strong> module for your first
            lesson, or head over to the <strong>Awareness</strong> section to
            understand deaf culture and communication etiquette.
          </p>
        </section>

        <section className="db-next db-reveal" style={{ "--i": 9 }}>
          <div>
            <p className="db-kicker">Keep going</p>
            <h2>Where to next?</h2>
          </div>

          <nav className="db-links" aria-label="Quick links">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`db-link tone-${link.tone}`}
              >
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
