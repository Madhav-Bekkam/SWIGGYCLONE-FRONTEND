import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🚀 This is the magic line that fixes your transitions
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}