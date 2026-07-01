import { useEffect, useState } from "react";

export function useShouldAnimate() {
  const [should, setShould] = useState(false);

  useEffect(() => {
    setShould(false);
  }, []);

  return should;
}
