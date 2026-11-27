// Small pixel accents are drawn separately from the unchanged dog artwork.
export function signatureHead(id: string) {
  switch (id) {
    case 'farquaad': return <><path d="M-3 4V0h3v-4h3v-2h13v2h3v4h3v10h-3V3h-2V1H1v2h-2v7h-2z" fill="#34262d" stroke="#4b3029" /><path d="M4-5v-6h3l3 3 3-4 3 4 3-3h2v6z" fill="#e5b744" stroke="#4b3029" /><path d="M-3 2h24v2H-3z" fill="#a62f37" /></>;
    case 'shrek': return <><path d="M0 3v-4h-2v-5h3v3h3l3 4M15 1l3-4h3v-3h3v5h-2v4" fill="#a2bb52" stroke="#53672d" strokeWidth="2" /><path d="M-1-5h3m19 0h3" stroke="#6d8a39" strokeWidth="2" /></>;
    case 'toad': return <><path d="M-4 4v-5l3-4h3v-2h15v2h3l3 4v5z" fill="#fff8ed" stroke="#553a30" /><path d="M2-4h6v5H2zm12-1h5v5h-5z" fill="#d9463d" /></>;
    case 'flower': return <><path d="M-1 5l-4-2v-4l4-2 2-4h4l3 3 3-4h4l2 4 4 1 2 4-3 3-3 1-1-3-3-1-2-2-3 2-4-1-2 2z" fill="#ec98ae" stroke="#9e526f" /><path d="M2-3h3m8-1h3" stroke="#ffd4d6" strokeWidth="2" /></>;
    case 'bee': return <><path d="M5 3V-6m10 9v-9" stroke="#493628" strokeWidth="2" /><path d="M3-9h4v4H3zm10 0h4v4h-4z" fill="#f7ca48" stroke="#493628" /><path d="M2 2h16v2H2z" fill="#efc83d" /></>;
    case 'pikachu': return <><path d="M1 3L-1-10h5l4 11M13 1l5-11h4L20 3" fill="#f5d33d" stroke="#493628" /><path d="M-1-10h5l1 4H0zm19 0h4l-1 4h-5z" fill="#392b29" /></>;
    case 'trojan': return <><path d="M-2 3V-1l4-4h14l4 4v4z" fill="#d7b15e" stroke="#65462e" /><path d="M0 0h19v2H0zM9 2h2v7H9z" fill="#efcf7b" /><path d="M4-5v-3h2v-2h9v2h3v3z" fill="#b83c3a" stroke="#65462e" /></>;
    case 'britney': return <><path d="M-2 4V0h3v-3h15v3h3v4h-3V2H1v2z" fill="#e9c981" stroke="#74513c" /><path d="M-3 2h3v8h-4V5h1zm21 0h3v8h-4V5h1z" fill="#e9c981" stroke="#74513c" /><path d="M-3 2h3v3h-3zm21 0h3v3h-3z" fill="#eea0b6" /></>;
    case 'elmo': return <><path d="M-2 3V0h2v-3h4v2h3v-3h7v3h4v3h3v3h-3V2H1v3h-3z" fill="#d6453b" stroke="#90332c" /><path d="M2-5h6v5H2zm10 0h6v5h-6z" fill="#fff9e9" stroke="#4b3029" /><path d="M4-3h2v2H4zm10 0h2v2h-2z" fill="#352722" /></>;
    case 'bush': return <><path d="M-4 5v-4h2v-4h3l2-4 4 2 3-4 3 3 4-2 2 4 4 1v4h-3V3h-4l-2-3-4 2-3-2-3 2H0v3z" fill="#4d853c" stroke="#385d2f" /><path d="M1-2h3v2H1zm9-3h3v2h-3zm7 2h3v2h-3z" fill="#90b94f" /></>;
    case 'omen': return <><path d="M-4 8V1l3-6h3v-2h15v2h3l3 6v7h-3V3l-4-5H3L0 3v5z" fill="#362d50" stroke="#7e629c" strokeWidth="2" /><path d="M6-3h1v3H6zm4 0h1v4h-1zm4 0h1v3h-1z" fill="#89d9df" /></>;
    case 'lorax': return <path d="M0 9h3v-2h5v2H6v2H0zm11 0h2V7h5v2h2v2h-9z" fill="#d98c36" stroke="#aa6429" />;
    case 'killjoy': return <><path d="M-1 4V0h2v-4h16v4h2v4z" fill="#57804b" stroke="#354e37" /><path d="M-2 3h22v2H-2z" fill="#74a060" /><path d="M8-3h4v3H8z" fill="#e1bd50" /></>;
    case 'teemo': return <><path d="M-2 4V0h2v-4h16v4h3v4z" fill="#728748" stroke="#455232" /><path d="M-3 3h23v2H-3z" fill="#8fa65d" /><path d="M2-3h6v4H2zm9 0h6v4h-6z" fill="#d55a50" stroke="#66432f" /><path d="M4-2h2v2H4zm9 0h2v2h-2z" fill="#87aeb1" /></>;
    case 'ahri': return <><path d="M-1 4L-3-6h5l4 7M14 1l5-7h5L20 4" fill="#3c3046" stroke="#53374b" /><path d="M0-4h2l2 5H2zm19 0h2l-2 5h-2z" fill="#edb2bd" /><path d="M1 4V1h4V0h11v2h3v3h-3V3H5v2z" fill="#342c42" /></>;
    case 'goth': case 'egirl': return <><path d="M-2 5V1h2v-4h16v2h3v6h-3V2H2v4h-4z" fill="#352c3b" stroke="#4b3037" /><path d="M0-3h5l3 2 3-2h5v4h-5L8 0 5 1H0z" fill={id === 'egirl' ? '#ec9fc0' : '#a78b9e'} stroke="#523a48" /></>;
    default: return null;
  }
}
