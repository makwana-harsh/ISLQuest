import { useCallback, useEffect, useMemo, useState } from "react";

import { getLearnModules, getModuleSigns, getLearnSign } from "../../api/learnIsl.api";

import ModulePage from "./ModulePage";
import Stars, { getStarCount } from "./Stars";

import "../../styles/LearnISL/LearnISL.style.css";

const XP_PER_LEVEL = 300; // arbitrary pacing for the level bar

function LearnISLPage() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [signs, setSigns] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null);

  const [loading, setLoading] = useState(true);
  const [openingModule, setOpeningModule] = useState(null);
  const [error, setError] = useState("");

  const loadModules = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const data = await getLearnModules();
      setModules(data.modules);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load modules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const openModule = async (module) => {
    if (openingModule) return;

    try {
      setError("");
      setOpeningModule(module.moduleNumber);

      const data = await getModuleSigns(module.moduleNumber);

      setSigns(data.signs);
      setSelectedModule(module);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load module");
    } finally {
      setOpeningModule(null);
    }
  };

  const openSign = async (signId) => {
    try {
      setError("");

      const data = await getLearnSign(signId);
      setSelectedSign(data.sign);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sign");
    }
  };

  const closeModule = () => {
    setSelectedModule(null);
    setSelectedSign(null);
    // A quiz may have improved the score, so refresh the map quietly
    loadModules(true);
  };

  // ---- game-y derived stats ----
  const totalXp = useMemo(() => modules.reduce((sum, m) => sum + (Number(m.score) || 0), 0), [modules]);
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);
  const totalStars = useMemo(() => modules.reduce((sum, m) => sum + getStarCount(m.score), 0), [modules]);

  // First module that hasn't been started yet — gets the "start here" pulse
  const nextUpNumber = useMemo(() => {
    const notStarted = modules.find((m) => (Number(m.score) || 0) === 0);
    return notStarted ? notStarted.moduleNumber : null;
  }, [modules]);

  return (
    <div className="ui-scope ui-page ln-page">
      <div className="ui-wrap">
        <header className="ln-head">
          <div>
            <h1>Learn ISL</h1>
            <p>Walk the path one module at a time. Clear the quiz at the end to earn stars.</p>
          </div>

          {!loading && modules.length > 0 && (
            <div className="ln-hud">
              <div className="ln-hud-badge">
                <span>Lv</span>
                <strong>{level}</strong>
              </div>
              <div className="ln-hud-xp">
                <div className="ln-xp-bar" role="img" aria-label={`${xpIntoLevel} of ${XP_PER_LEVEL} XP into level ${level}`}>
                  <span style={{ width: `${xpPct}%` }} />
                </div>
                <span className="ln-hud-caption">{totalXp} XP total</span>
              </div>
              <div className="ln-hud-stars" title={`${totalStars} stars earned`}>
                ⭐ <strong>{totalStars}</strong>
              </div>
            </div>
          )}
        </header>

        {error && (
          <p className="ui-alert ln-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <div className="ln-grid" aria-busy="true">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="ui-skel ln-skel" />
            ))}
          </div>
        ) : modules.length === 0 ? (
          <div className="ui-empty">
            <p>No modules are available yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="ln-path">
            {modules.map((module, index) => {
              const stars = getStarCount(module.score);
              const done = stars === 3;
              const started = (Number(module.score) || 0) > 0;
              const isNext = module.moduleNumber === nextUpNumber;
              const side = index % 2 === 0 ? "left" : "right";

              return (
                <div className={`ln-node-row side-${side}`} key={module.moduleNumber}>
                  <button
                    type="button"
                    className={`ln-node ${done ? "is-done" : started ? "is-started" : "is-new"} ${isNext ? "is-next" : ""}`}
                    onClick={() => openModule(module)}
                    disabled={openingModule !== null}
                  >
                    {isNext && <span className="ln-flag">Start here</span>}
                    {done && <span className="ln-crown">👑</span>}

                    <span className="ln-node-no">{module.moduleNumber}</span>
                    <span className="ln-node-ring" aria-hidden="true" />
                  </button>

                  <div className="ln-node-card">
                    <h2>{module.moduleName}</h2>
                    <Stars score={module.score} size={18} />
                    <span className="ln-node-status">
                      {openingModule === module.moduleNumber
                        ? "Opening..."
                        : started
                        ? `Best ${module.score}/100`
                        : "Not attempted"}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="ln-path-end">
              <span>🏁</span>
              <p>{totalStars === modules.length * 3 ? "Path complete!" : "More modules ahead"}</p>
            </div>
          </div>
        )}
      </div>

      {selectedModule && (
        <ModulePage
          module={selectedModule}
          signs={signs}
          selectedSign={selectedSign}
          onOpenSign={openSign}
          onClose={closeModule}
          onCloseSign={() => setSelectedSign(null)}
        />
      )}
    </div>
  );
}

export default LearnISLPage;
