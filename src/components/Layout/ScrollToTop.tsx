import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Nếu có hash (#section) thì giữ để browser tự scroll tới anchor
    if (hash) return;

    window.scrollTo(0, 0);
  }, [pathname, search, hash]);

  return null;
}
