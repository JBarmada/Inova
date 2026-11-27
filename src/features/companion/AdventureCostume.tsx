type AdventureId = "trojan" | "ahri" | "teemo";

export function AdventureCostume({ id, seated, headY, showHat }: {
  id: AdventureId; seated: boolean; headY: number; showHat: boolean;
}) {
  const resting = headY >= 4;
  const compact = seated || resting;
  const hem = resting ? 3 - headY : seated ? -1 : -headY;
  return <>
    <g transform={`translate(0 ${hem})`}>
      {id === "trojan" && <KnightArmor compact={compact} />}
      {id === "ahri" && <FoxRobe compact={compact} />}
      {id === "teemo" && <ScoutKit compact={compact} />}
    </g>
    {showHat && <g transform={resting ? "translate(0 3)" : undefined}>
      {id === "trojan" && <KnightHelmet />}
      {id === "ahri" && <FoxWig />}
      {id === "teemo" && <ScoutCap />}
    </g>}
  </>;
}

function KnightHelmet() {
  return <>
    <path fill="#70393d" d="M10 13V9h2V7h4V5h5V4h11v1h5v2h5v3h2v4h2v9h-5v-5h-3v-3h-3v-3H18v1z" />
    <path fill="#c45147" d="M12 11V9h4V7h5V6h10v1h6v2h4v3h2v6h-2v-3h-3v-3h-4V9H18v2z" />
    <path fill="#e66d58" d="M15 9h5V7h9v1h-8v2h-6z" />
    <path fill="#775038" d="M5 34V22h3v-4h3v-3h6v-2h13v2h5v3h4v4h2v11h-4v6h-4V29h3v-6h-3v-3H13v2h-3v7H8v5z" />
    <path fill="#daa75c" d="M7 32v-9h3v-4h3v-3h5v-2h11v2h5v3h3v4h2v9h-3v5h-2v-7h3v-8h-3v-3h-5v-2H17v2h-5v2H9v11z" />
    <path fill="#ffe099" d="M11 19h4v-2h5v-1h8v1h4v2h-3v-1H20v1h-5v2h-4zM8 24h1v5H8z" />
  </>;
}

function KnightArmor({ compact }: { compact: boolean }) {
  return <>
    <path fill="#763b43" d={compact ? "M25 40h12v2h5v6h-4v2h-8z" : "M27 43h8v-4h6v-2h8v2h4v4h3v5h-5v2h-9v-2H31z"} />
    <path fill="#b14d49" d={compact ? "M29 41h7v2h5v4h-4v2h-5z" : "M33 44h3v-3h6v-2h6v2h4v4h3v2h-5v2h-7v-2H33z"} />
    <path fill="#674938" d={compact
      ? "M9 40h5v2h15v-2h5v5h-2v6H12v-2H9z"
      : "M9 40h5v2h15v-2h6v2h7v8h-5v1h-5v-1h-5v1H12v-2H9z"} />
    <path fill="#a47547" d="M11 43h6v1h12v-2h3v7h-5v1H13v-2h-2z" />
    <path fill="#ebc279" d="M12 41h5v4h-5zm16 0h5v4h-5zm-9 6h2v1h3v-1h2v2h-7z" />
    {!compact && <path fill="#d19c59" d="M36 44h2v5h-2zm4 0h2v5h-2z" />}
  </>;
}

function FoxWig() {
  return <>
    <path fill="#3f324e" d="M5 32V20h2v-6h3V9h2v4h3v3h6v-2h7v2h4v-5h3V8h2v6h2v7h2v12h-3v5h-5v-4h3V24h-4v-4h-5v3h-3v-3h-4v4h-4v-2h-4v4h-3v9H6z" />
    <path fill="#655472" d="M8 23v-7h3v-4h1v3h3v3h8v-2h5v2h5v-4h3v-3h1v5h1v5h-2v-2h-7v-1H21v1h-6v2h-4v2z" />
    <path fill="#c7889a" d="M10 15h2v2h2v2h-4zm24 0h2v4h-3v-2h1z" />
    <path fill="#e3b86a" d="M31 20h3v2h2v2h-5zm5 2h3v3h-3z" />
  </>;
}

function FoxRobe({ compact }: { compact: boolean }) {
  return <>
    <path fill="#752f48" d={compact
      ? "M8 39h5v2h6v2h9v-2h6v-3h5v6h-3v5h-5v2h-8v-1h-7v-1h-5v-3H8z"
      : "M8 40h5v2h6v2h9v-3h7v-3h7v2h5v2h5v4h-3v3h-8v2h-7v-1H16v-1h-5v-3H8z"} />
    <path fill="#bd4c55" d="M10 42h4v2h5v2h8v-2h5v-2h5v3h-3v4h-9v-1H15v-1h-5z" />
    <path fill="#f6dfa6" d="M11 42h4v2h5v2h-4v-1h-4zm15 4h3v-2h5v-2h3v2h-2v2h-5v1h-4z" />
    <path fill="#89b9d8" d="M21 45h4v3h-4z" />
    {!compact && <path fill="#db8d6d" d="M40 42h4v2h4v2h-5v-2h-3z" />}
  </>;
}

function ScoutCap() {
  return <>
    <path fill="#514944" d="M4 24v-5h3v-3h2v-3h4v-3h6V8h7V4h3V2h9v2h2v3h-3v2h-4v4h3v3h3v3h3v5h-8v-2H13v2z" />
    <path fill="#71834d" d="M6 23v-4h3v-3h2v-3h4v-2h6V9h7v2h5v3h2v3h3v3h2v3h-5v-2H12v2z" />
    <path fill="#9daa65" d="M11 19h3v-3h4v-2h10v2h6v2H18v1h-5v1h-2z" />
    <path fill="#5475a8" d="M27 10V6h3V4h8v2h-2v2h-4v2z" />
    <path fill="#829bcc" d="M30 5h6v1h-4v1h-2z" />
    <path fill="#91423e" d="M12 12h8v2h2v5H11v-5h1zm12 1h9v2h2v4H24z" />
    <path fill="#bfd6e6" d="M13 14h6v3h-6zm13 1h7v3h-7z" />
  </>;
}

function ScoutKit({ compact }: { compact: boolean }) {
  return <>
    <ScoutPack compact={compact} />
    <path fill="#744140" d="M9 39h5v2h6v2h9v-2h7v4h-4v2h-4v2h-7v-1h-5v-2h-4v-3H9z" />
    <path fill="#c85549" d="M11 41h4v2h6v2h8v-2h5v1h-4v2h-3v2h-6v-1h-5v-2h-3v-2h-2z" />
    <path fill="#dc7e5e" d="M14 43h4v1h3v1h-4v-1h-3z" />
    <path fill="#536546" d="M34 44h6v2h1v4h-6v-2h-1z" />
    <path fill="#c6ab68" d="M36 46h3v2h-3z" />
  </>;
}

function ScoutPack({ compact }: { compact: boolean }) {
  return <>
    <path fill="#574b3c" d={compact
      ? "M35 39h2v-3h3v-3h7v2h2v4h-2v7h-2v3H35z"
      : "M35 39h2v-4h3v-4h10v2h2v5h-2v8h-3v3H35z"} />
    <path fill="#86734e" d={compact
      ? "M37 40h2v-3h2v-2h5v1h1v2h-2v7h-1v2h-7z"
      : "M37 40h2v-4h2v-3h8v1h1v3h-2v8h-2v2h-9z"} />
    <path fill="#be9e66" d={compact
      ? "M41 36h5v2h-5zm0 5h2v4h-2z"
      : "M42 34h6v2h-6zm0 6h2v5h-2z"} />
    <path fill="#64563e" d={compact ? "M39 38h6v1h-6z" : "M39 37h9v1h-9z"} />
  </>;
}
