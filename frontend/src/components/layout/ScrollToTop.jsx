import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Mounted once near the top of the app (inside <BrowserRouter>).
// React Router does NOT reset scroll position on navigation by
// default — without this, clicking a tool link while scrolled
// down on the current page leaves the new page scrolled down too.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}