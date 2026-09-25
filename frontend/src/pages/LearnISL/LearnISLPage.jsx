import { useCallback, useEffect, useState } from "react";

import { getLearnModules, getModuleSigns, getLearnSign } from "../../api/learnIsl.api";

import ModulePage from "./ModulePage";
import Stars from "./Stars";

import "../../styles/LearnISL/LearnISL.style.css";

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
    // A quiz may have improved the score, so refresh the stars quietly
    loadModules(true);
  };

  const tones = ["teal", "sun", "pink", "sky"];

  return (
    <div className="ui-scope ui-page ln-page">
      <div className="ui-wrap">
        <header className="ln-head">
          <h1>Learn ISL</h1>
          <p>Work through one module at a time. Finish a quiz to earn up to three stars.</p>
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
          <div className="ln-grid">
            {modules.map((module, index) => (
              <button
                type="button"
                key={module.moduleNumber}
                className={`ln-module tone-${tones[index % tones.length]}`}
                onClick={() => openModule(module)}
                disabled={openingModule !== null}
              >
                <span className="ln-module-no">Module {module.moduleNumber}</span>
                <h2>{module.moduleName}</h2>

                <span className="ln-module-foot">
                  <Stars score={module.score} />
                  <span>
                    {openingModule === module.moduleNumber
                      ? "Opening..."
                      : module.score > 0
                      ? `Best ${module.score}/100`
                      : "Not attempted"}
                  </span>
                </span>
              </button>
            ))}
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
