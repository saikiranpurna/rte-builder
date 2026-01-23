import { useState, useEffect, createContext, useContext } from "react";
import GettingStarted from "./pages/GettingStarted";
import Installation from "./pages/Installation";
import BasicUsage from "./pages/BasicUsage";
import ToolbarConfig from "./pages/ToolbarConfig";
import APIReference from "./pages/APIReference";
import Examples from "./pages/Examples";
import Playground from "./pages/Playground";

// Theme Context
type Theme = "light" | "dark";
const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

type Page =
  | "getting-started"
  | "installation"
  | "basic-usage"
  | "toolbar"
  | "api"
  | "examples"
  | "playground";

const navigation = [
  {
    title: "Getting Started",
    items: [
      { id: "getting-started" as const, label: "Introduction" },
      { id: "installation" as const, label: "Installation" },
      { id: "basic-usage" as const, label: "Basic Usage" },
    ],
  },
  {
    title: "Customization",
    items: [{ id: "toolbar" as const, label: "Toolbar Configuration" }],
  },
  {
    title: "Reference",
    items: [
      { id: "api" as const, label: "API Reference" },
      { id: "examples" as const, label: "Examples" },
    ],
  },
];

const pageComponents: Record<Page, React.ComponentType> = {
  "getting-started": GettingStarted,
  installation: Installation,
  "basic-usage": BasicUsage,
  toolbar: ToolbarConfig,
  api: APIReference,
  examples: Examples,
  playground: Playground,
};

function App() {
  const [activePage, setActivePage] = useState<Page>("getting-started");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("rte-theme");
    return (saved as Theme) || "light";
  });

  const isPlayground = activePage === "playground";

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("rte-theme", theme);
  }, [theme]);

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(2) as Page;
      if (hash && pageComponents[hash]) {
        setActivePage(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavClick = (pageId: Page) => {
    setActivePage(pageId);
    window.location.hash = `/${pageId}`;
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const ActiveComponent = pageComponents[activePage];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`docs-layout ${isPlayground ? "playground-mode" : ""}`}>
        {/* Header */}
        <header className="docs-header">
          <div className="header-left">
            {!isPlayground && (
              <button
                className="menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <a
              href="#/"
              className="logo"
              onClick={() => handleNavClick("getting-started")}
            >
              <span className="logo-icon">📝</span>
              <span className="logo-text">RTE Builder</span>
            </a>
            <span className="version-badge">v1.0.0</span>
            <span className="license-badge">MIT</span>
          </div>

          <div className="header-center">
            <button
              className={`header-nav-btn ${!isPlayground ? "active" : ""}`}
              onClick={() => handleNavClick("getting-started")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              Docs
            </button>
            <button
              className={`header-nav-btn playground-btn ${isPlayground ? "active" : ""}`}
              onClick={() => handleNavClick("playground")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Playground
            </button>
          </div>

          <div className="header-right">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
            <a
              href="https://github.com/AshutoshBuilds/rte-builder"
              className="header-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://www.npmjs.com/package/rte-builder"
              className="header-link npm-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
              </svg>
              <span>npm</span>
            </a>
          </div>
        </header>

        <div className="docs-body">
          {/* Sidebar - hidden in playground mode */}
          {!isPlayground && (
            <aside
              className={`docs-sidebar ${sidebarOpen ? "open" : "closed"}`}
            >
              <nav className="sidebar-nav">
                {navigation.map((section) => (
                  <div key={section.title} className="nav-section">
                    <h4 className="nav-title">{section.title}</h4>
                    <ul className="nav-list">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => handleNavClick(item.id)}
                            className={`nav-link ${activePage === item.id ? "active" : ""}`}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* Open Source Banner */}
              <div className="sidebar-footer">
                <div className="open-source-card">
                  <div className="os-icon">🌟</div>
                  <h5>Open Source</h5>
                  <p>Free MIT License</p>
                  <p className="os-subtitle">Contributions welcome!</p>
                  <a
                    href="https://github.com/AshutoshBuilds/rte-builder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="os-link"
                  >
                    Contribute on GitHub →
                  </a>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={`docs-main ${isPlayground ? "full-width" : ""}`}>
            <div
              className={`docs-content ${isPlayground ? "playground-content" : ""}`}
            >
              <ActiveComponent />
            </div>

            {/* Footer - not in playground */}
            {!isPlayground && (
              <footer className="docs-footer">
                <div className="footer-content">
                  <div className="footer-section">
                    <h4>RTE Builder</h4>
                    <p>
                      A modern, lightweight rich text editor built with TipTap
                      and React.
                    </p>
                    <div className="footer-badges">
                      <span className="footer-badge">MIT License</span>
                      <span className="footer-badge">TypeScript</span>
                      <span className="footer-badge">React 18+</span>
                    </div>
                  </div>
                  <div className="footer-section">
                    <h5>Resources</h5>
                    <ul>
                      <li>
                        <a href="#/getting-started">Documentation</a>
                      </li>
                      <li>
                        <a href="#/api">API Reference</a>
                      </li>
                      <li>
                        <a href="#/examples">Examples</a>
                      </li>
                      <li>
                        <a href="#/playground">Playground</a>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-section">
                    <h5>Community</h5>
                    <ul>
                      <li>
                        <a
                          href="https://github.com/AshutoshBuilds/rte-builder"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/AshutoshBuilds/rte-builder/issues"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Report Issues
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/AshutoshBuilds/rte-builder/pulls"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Pull Requests
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.npmjs.com/package/rte-builder"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          npm Package
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-section">
                    <h5>Contribute</h5>
                    <p className="contribute-text">
                      We welcome contributions! Whether it's bug fixes, new
                      features, or documentation improvements.
                    </p>
                    <a
                      href="https://github.com/AshutoshBuilds/rte-builder/blob/main/CONTRIBUTING.md"
                      className="contribute-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contributing Guide
                    </a>
                  </div>
                </div>
                <div className="footer-bottom">
                  <p>
                    Released under the MIT License. Free for personal and
                    commercial use.
                  </p>
                  <p>© 2024 RTE Builder Contributors</p>
                </div>
              </footer>
            )}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
