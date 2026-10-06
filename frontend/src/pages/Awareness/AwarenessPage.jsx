import { useState } from "react";

import { awarenessData } from "../../assets/awarenessData";

import "../../styles/Awareness/AwarenessPage.style.css";

const TABS = [
  { key: "overview", label: "What is ISL?" },
  { key: "linguistics", label: "History and variations" },
  { key: "standardization", label: "ISLRTC and standards" },
  { key: "legal", label: "RPwD Act and policies" },
  { key: "resources", label: "Directories and links" },
];

export default function AwarenessPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const overview = awarenessData?.overview;
  const history = awarenessData?.historyAndVariations;
  const standards = awarenessData?.standardization;
  const legal = awarenessData?.legalFramework ?? [];
  const directories = awarenessData?.directories ?? [];

  return (
    <div className="ui-scope ui-page aw-page">
      <div className="ui-wrap">
        <header className="aw-head">
          <h1>Understanding Indian Sign Language</h1>
          <p>
            Where the language comes from, who looks after it, and what the law says about your right to use it.
          </p>
        </header>

        <div className="aw-tabs" role="tablist" aria-label="Awareness sections">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`aw-tab-${tab.key}`}
              aria-selected={activeTab === tab.key}
              aria-controls={`aw-panel-${tab.key}`}
              className={`aw-tab ${activeTab === tab.key ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          key={activeTab}
          className="aw-panel"
          role="tabpanel"
          id={`aw-panel-${activeTab}`}
          aria-labelledby={`aw-tab-${activeTab}`}
        >
          {activeTab === "overview" && (
            <>
              <div className="aw-lead aw-lead--teal">
                <h2>In short</h2>
                <p>{overview?.definition}</p>
              </div>

              <h2 className="aw-sub">What makes it a language of its own</h2>
              <div className="aw-grid">
                {(overview?.linguisticFeatures ?? []).map((item, index) => (
                  <article key={index} className={`aw-tile tone-${index % 4}`}>
                    <h3>{item.feature}</h3>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === "linguistics" && (
            <>
              <div className="aw-lead aw-lead--sun">
                <h2>How it developed</h2>
                <p>{history?.historySummary}</p>
              </div>

              <h2 className="aw-sub">Regional dialects</h2>
              <div className="aw-grid">
                {(history?.regionalDialects ?? []).map((dialect, index) => (
                  <article key={index} className={`aw-tile tone-${index % 4}`}>
                    <h3>{dialect.region}</h3>
                    <p>{dialect.characteristics}</p>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === "standardization" && (
            <>
              <div className="aw-lead aw-lead--sky">
                <h2>The national body</h2>
                <p>{standards?.islrtcOverview}</p>
              </div>

              <h2 className="aw-sub">Milestones</h2>
              <ol className="aw-timeline">
                {(standards?.keyMilestones ?? []).map((milestone, index) => (
                  <li key={index}>
                    <span className="aw-year">{milestone.year}</span>
                    <div>
                      <h3>{milestone.title}</h3>
                      <p>{milestone.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}

          {activeTab === "legal" && (
            <div className="aw-stack">
              {legal.map((item, index) => (
                <article key={index} className="aw-law">
                  <div className="aw-law-head">
                    <h3>{item.law}</h3>
                    {item.focus && <span className="aw-chip">{item.focus}</span>}
                  </div>
                  <p>{item.details}</p>
                </article>
              ))}
            </div>
          )}

          {activeTab === "resources" && (
            <div className="aw-grid">
              {directories.map((resource, index) => (
                <article key={index} className="aw-resource">
                  <div>
                    <div className="aw-law-head">
                      <h3>{resource.name}</h3>
                      {resource.type && <span className="aw-chip aw-chip--plain">{resource.type}</span>}
                    </div>
                    <p>{resource.description}</p>
                  </div>

                  <a
                    className="ui-btn ui-btn--sm"
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
