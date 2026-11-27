const silhouette = (sitting: boolean) => sitting
  ? 'M1 2h3V0h15v2h3v8h-3v2H5v-2H1z'
  : 'M-8 5h4V4h5V3h4V1h5V0h8v2h3v2h2v8h-3v1H2v-1h-5v-1h-5z';

export function signatureBody(id: string, sitting: boolean) {
  const shape = silhouette(sitting);
  switch (id) {
    case 'farquaad': return <><path d={shape} fill="#b33437" stroke="#56352d" /><path d="M2 3h3l4 3 4-4h3l-7 6z" fill="#f2c55a" /><path d="M1 9h19v2H1z" fill="#51352a" /><path d="M8 8h4v4H8z" fill="#e9bc50" /><path d="M-6 7h2v3h-2zm22-4h2v4h-2z" fill="#e8b54a" /></>;
    case 'shrek': return <><path d={shape} fill="#f6e9ce" stroke="#614732" /><path d="M2 2h4l3 4-1 6H3l-2-3zm10 0h4l4 2v6l-3 2h-5l-1-6z" fill="#79523b" /><path d="M3 5h2m9 2h2M5 9h2m9-5h2" stroke="#a97b56" /></>;
    case 'bathrobe': case 'spa': return <><path d={shape} fill="#f5f0eb" stroke="#968b91" /><path d="M0 3l8 5 8-6M3 3l5 3 4-4" fill="none" stroke="#d4c7d4" strokeWidth="2" /><path d="M1 9h19v2H1z" fill="#d3c3d1" /><path d="M8 8h4v3H8z" fill="#f9f3ee" stroke="#b7a6b4" /></>;
    case 'usc-hoodie': return <><path d={shape} fill="#a72b35" stroke="#5c292e" /><path d="M1 3l4-2 3 3 3-3h5l3 2" fill="none" stroke="#e2a939" strokeWidth="1" /><path d="M5 5v3h2V5m2 0h2v1H9v2h2m2-3h2v1h-1v1h1v1h-2" fill="none" stroke="#f4d35c" strokeWidth="1" /><path d="M2 10h16" stroke="#e1ad43" /></>;
    case 'bush': return <><path d={shape} fill="#4d8439" stroke="#395f2c" /><path d="M-7 6l2-4 3 2 3-3 3 2 4-3 3 2 4-3 3 3 4 1v6l-3 3-4-2-4 3-4-2-3 2-3-2-3 1z" fill="#5a973e" stroke="#395f2c" /><path d="M-4 6h3v2h-3zm7-3h3v2H3zm7 3h3v2h-3zm7-3h3v2h-3z" fill="#9fc65b" /></>;
    case 'toad': return <><path d={shape} fill="#f6dfb7" stroke="#65472e" /><path d="M1 3h5l2 4-1 5H2L0 9zm11-2h4l5 3v6l-3 2h-6l-1-5z" fill="#4570bc" stroke="#ecd06a" strokeWidth="1" /></>;
    case 'bee': return <><path d={shape} fill="#f2cb49" stroke="#58412c" /><path d="M5 3h3v9H5zm7-2h3v11h-3z" fill="#47372d" /><path transform={sitting ? 'translate(7 4)' : undefined} d="M12 1v-3h2v-2h3v1h1v3h-2v2h-4zm6 0v-3h2v-2h3v1h1v3h-2v2h-4z" fill="#d7f1ed" stroke="#6d9290" strokeWidth=".5" /></>;
    case 'pikachu': return <><path d={shape} fill="#f1d343" stroke="#765a2e" /><path d="M13 4h3v2h-3zm1 4h3v2h-3z" fill="#ac7542" /><path d="M20 3h3V1h3v3h-2v2h2v2h-4V7h-2z" fill="#f3d343" stroke="#765a2e" /></>;
    case 'christmas-present': return <><path d={shape} fill="#c74941" stroke="#6e3831" /><path d="M8 1h4v11H8zM1 5h20v3H1z" fill="#f3d16d" /><path d="M0 2h21v2H0z" fill="#ae3934" /></>;
    case 'wonder-bread': return <><path d={shape} fill="#fcf5e6" stroke="#a27b5b" /><path d="M2 4h3v3H2zm12 3h3v3h-3z" fill="#e64a47" /><path d="M8 3h3v3H8z" fill="#4080c8" /><path d="M7 8h3v3H7zm11-5h2v2h-2z" fill="#f1c852" /></>;
    case 'turkey': return <><path d={shape} fill="#b8773d" stroke="#75462b" /><path d="M3 7V4h2V3h4v2h2v3H9v2H5V9H3zm11-4h4v2h2v3h-2v2h-4V8h-2V5h2z" fill="#d49753" stroke="#85542e" /><path d="M1 6H0V4h2v1h2v2H2v1H1zm18 0h2V5h2v2h-2v2h-2z" fill="#fff0cf" /></>;
    case 'shrimp': return <><path d={shape} fill="#e79995" stroke="#9b5958" /><path d="M5 3h2v8H5zm5-2h2v11h-2zm5 1h2v10h-2z" fill="#f8bfad" /><path d="M20 5h3V3h3v2h-2v2h3v2h-4V8h-3z" fill="#f4aaa0" stroke="#a65e62" /></>;
    case 'white-house': return <><path d={shape} fill="#eee9de" stroke="#a49a90" /><path d="M1 3h20v2H1zM2 10h18v1H2z" fill="#d0c6ba" /><path d="M3 5h2v4H3zm4 0h2v4H7zm4 0h2v4h-2zm4 0h2v4h-2z" fill="#86a4bb" /></>;
    case 'soju': return <><path d={shape} fill="#4f9660" stroke="#316545" /><path d="M4 4h11v6H4z" fill="#f3f2db" /><path d="M6 6h7v1H6zM6 8h5v1H6z" fill="#7da782" /></>;
    case 'clown': return <><path d={shape} fill="#5183c2" stroke="#4c496e" /><path d="M2 3h18v2H2z" fill="#f2eadd" /><path d="M3 6h3v3H3zm10-1h3v3h-3z" fill="#f0c64d" /><path d="M8 9h3v3H8z" fill="#dc5149" /></>;
    case 'iso': return <><path d={shape} fill="#5b4e7c" stroke="#352f50" /><path d="M1 2l6 3 3-3h8v2l-7 3H7L1 4z" fill="#a59aca" /><path d="M8 6v6m5-7v4h4" fill="none" stroke="#cec4e8" strokeWidth="1" /></>;
    case 'chicken-nugget': return <><path d={shape} fill="#dc9b36" stroke="#9a672d" /><path d="M2 5h2v2H2zm5-3h2v2H7zm3 6h2v2h-2zm6-5h2v2h-2zm1 6h2v2h-2z" fill="#f3bf5d" /><path d="M4 8h1v1H4zm10-4h1v1h-1z" fill="#b57b2e" /></>;
    case 'harry-potter': return <><path d={shape} fill="#37303b" stroke="#261f29" /><path d="M1 2l7 5 7-5M8 7v5" fill="none" stroke="#c24a49" strokeWidth="2" /><path d="M8 6h2v4H8z" fill="#f1cd7a" /><path d="M9 7h2v1H9zm0 2h2v1H9z" fill="#b84042" /></>;
    case 'lorax': return <><path d={shape} fill="#e59745" stroke="#a96130" /><path d="M3 4h4v2H3zm9-2h3v2h-3zm2 5h4v2h-4z" fill="#f2b968" /><path d="M2 10h15v1H2z" fill="#d08038" /></>;
    case 'maple-leaf': return <><path d={shape} fill="#c8443d" stroke="#8b302e" /><path d="M8 3h2l1 2 2-1-1 3 2 1-3 1v2h-2V9L6 8l2-1-1-3 2 1z" fill="#fff6e2" /></>;
    case 'bibble': return <><path d={shape} fill="#98c9df" stroke="#648da7" /><path d="M1 3h3v2H1zm6-2h3v2H7zm7 2h4v2h-4z" fill="#d0e9ee" /><path d="M4 7h2V6h2v1h2v2H9v1H6V9H4zm10 0h2V6h2v1h2v2h-2v1h-2V9h-2z" fill="#efafd2" /></>;
    case 'fungus': return <><path d={shape} fill="#c58bc1" stroke="#8f5e8e" /><path d="M3 3h3v3H3zm8-1h3v3h-3zm5 5h3v3h-3z" fill="#f1d4e5" /><path d="M5 9h5v2H5z" fill="#ecc7de" /></>;
    case 'elmo': return <><path d={shape} fill="#d74940" stroke="#963a35" /><path d="M2 3h2v2H2zm5 3h2v2H7zm7-4h2v2h-2zm2 7h2v2h-2z" fill="#ee6e60" /><path d="M1 10h3m5 1h3m4-1h3" stroke="#b43b34" /></>;
    case 'mort': return <><path d={shape} fill="#a9846e" stroke="#735749" /><path d="M2 2h5l3 3 4-3h4l-2 7H4z" fill="#f1dec3" /><path d="M5 8h2v1H5zm8 0h2v1h-2z" fill="#c2a891" /></>;
    case 'trojan': return <><path d={shape} fill="#a77b38" stroke="#694a2b" /><path d="M2 3h17v2H2zm1 6h15v2H3z" fill="#e2c273" /><path d="M7 5h6v5H7z" fill="#d7b363" stroke="#74532c" /><path d="M9 6h2v3H9z" fill="#a84637" /></>;
    case 'omen': return <><path d={shape} fill="#39314f" stroke="#27253d" /><path d="M0 2l8 4 8-4M0 5l8 4 8-4" fill="none" stroke="#8c75b0" strokeWidth="2" /><path d="M6 9h10v2H6z" fill="#675581" /></>;
    case 'killjoy': return <><path d={shape} fill="#e9c94a" stroke="#9e842b" /><path d="M2 2l6 4 7-4M8 6v6" fill="none" stroke="#a88735" /><path d="M3 7h4v3H3zm10 0h4v3h-4z" fill="#d6ae3c" stroke="#aa8c31" /></>;
    case 'ahri': return <><path d={shape} fill="#943f4b" stroke="#63323d" /><path d="M1 2l7 5 8-5" fill="none" stroke="#efded9" strokeWidth="2" /><path d="M7 6h3v3H7z" fill="#79b9bc" stroke="#d8bc74" /><path d="M18 3h4v3h-4zm0 5h4v3h-4z" fill="#e8d9e9" /></>;
    case 'teemo': return <><path d={shape} fill="#728b4f" stroke="#50613b" /><path d="M1 3h16v3H1z" fill="#bb5549" /><path d="M5 7h9v4H5z" fill="#b79a67" stroke="#7c6848" /><path d="M8 8h3v2H8z" fill="#e7d3a0" /></>;
    case 'goth': case 'egirl': return <><path d={shape} fill={id === 'goth' ? '#39323f' : '#634454'} stroke="#332c36" /><path d="M1 3h18v2H1zM3 9h15v2H3z" fill={id === 'goth' ? '#a695a6' : '#ed9db8'} /><path d="M7 5h4v4H7z" fill={id === 'goth' ? '#d2c5d0' : '#f4c7d1'} /><path d="M8 6h2v2H8z" fill="#694758" /></>;
    case 'britney': return <><path d={shape} fill="#e9e3dc" stroke="#8d7c7a" /><path d="M2 2l6 5 7-5M8 7v4" fill="none" stroke="#af9fa2" /><path d="M2 9h17v3H2z" fill="#80777e" /><path d="M5 9v3m4-3v3m4-3v3" stroke="#bcb1b4" /></>;
    default: return null;
  }
}
