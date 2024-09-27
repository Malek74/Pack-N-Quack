import { useMemo } from "react";

export default function Footer() {
  const year = useMemo(() => {
    return new Date().getFullYear();
  }, []);

  return <footer className="border-t border-gray-300 text-gray-800">Copyrights {year} all rights reserved</footer>;

}
