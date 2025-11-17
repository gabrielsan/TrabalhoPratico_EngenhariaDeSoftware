import { useState } from "react";

export default function IsDesktop() {
  const [resizer, setResizer] = useState(
    window.innerWidth <= 996 ? true : false
  );

  window.addEventListener("resize", () => {
    window.innerWidth > 996 ? setResizer(false) : setResizer(true);
  });

  return resizer;
}