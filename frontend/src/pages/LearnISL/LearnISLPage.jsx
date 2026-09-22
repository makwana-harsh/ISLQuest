import { useEffect, useState } from "react";

import {
  getLearnModules,
  getModuleSigns,
  getLearnSign,
} from "../../api/learnIsl.api";

import ModulePage from "./ModulePage";

import "../../styles/LearnISL/LearnISL.style.css";

function getStars(score) {
  if (score === 100) return "⭐⭐⭐";
  if (score >= 80) return "⭐⭐☆";
  if (score >= 60) return "⭐☆☆";
  return "☆☆☆";
}

function LearnISLPage() {
  const [modules, setModules] = useState([]);

  const [selectedModule, setSelectedModule] =
    useState(null);

  const [signs, setSigns] = useState([]);

  const [selectedSign, setSelectedSign] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);

        const data = await getLearnModules();

        setModules(data.modules);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load modules"
        );
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  const openModule = async (module) => {
    try {
      setError("");

      const data = await getModuleSigns(
        module.moduleNumber
      );

      setSigns(data.signs);
      setSelectedModule(module);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load module"
      );
    }
  };

  const openSign = async (signId) => {
    try {
      setError("");

      const data = await getLearnSign(signId);

      setSelectedSign(data.sign);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load sign"
      );
    }
  };

  if (loading) {
    return <div className="learn-loading">Loading...</div>;
  }

  return (
    <div className="learn-page">

      <div className="learn-header">
        <h1>Learn ISL</h1>

        <p>
          Learn Indian Sign Language step by step.
        </p>
      </div>

      {error && (
        <p className="learn-error">
          {error}
        </p>
      )}

      <div className="module-grid">
        {modules.map((module) => {

          return (
            <button
              key={module.moduleNumber}
              className="module-card"
              onClick={() => openModule(module)}
            >
              <span>
                Module {module.moduleNumber}
              </span>

              <h2>{module.moduleName}</h2>

              <span className="module-stars">
                {getStars(module.score)}
              </span>
            </button>
          );
        })}
      </div>

      {selectedModule && (
        <ModulePage
          module={selectedModule}
          signs={signs}
          selectedSign={selectedSign}
          onOpenSign={openSign}
          onClose={() => {
            setSelectedModule(null);
            setSelectedSign(null);
          }}
          onCloseSign={() => setSelectedSign(null)}
        />
      )}
    </div>
  );
}

export default LearnISLPage;