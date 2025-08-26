import { useState, useEffect } from "react";
import "./index.css";
import { Home, About } from "./pages";

function App() {
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = (e.target as HTMLAnchorElement).getAttribute("href");
        if (href) {
          window.history.pushState({}, "", href);
          setCurrentPath(href);
        }
      });
    });
  });

  switch (currentPath) {
    case "/":
      return <Home />;
    case "/about":
      return <About />;
    default:
      return <Home />;
  }
}

export default App;
