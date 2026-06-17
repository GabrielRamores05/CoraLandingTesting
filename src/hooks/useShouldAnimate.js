import { useEffect, useState } from "react";

export function useShouldAnimate() {
  const [should, setShould] = useState(false);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const check = () => setShould(!mqMotion.matches && !mqMobile.matches);
    check();
    mqMotion.addEventListener("change", check);
    mqMobile.addEventListener("change", check);
    return () => {
      mqMotion.removeEventListener("change", check);
      mqMobile.removeEventListener("change", check);
    };
  }, []);

  return should;
}
