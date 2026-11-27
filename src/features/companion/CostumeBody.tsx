import type { CostumeDesign } from './costumeDesigns';
import { signatureBody } from './CostumeSignatureBody';

export function CostumeBody({ design, sitting, id }: { design: CostumeDesign; sitting: boolean; id: string }) {
  const { cloth, trim, pattern } = design;
  const distinctive = signatureBody(id, sitting);
  if (distinctive) return distinctive;
  return <g>
    <path d={sitting ? "M1 2h3V0h15v2h3v8h-3v2H5v-2H1z" : "M0 6h3V4h3V2h5V0h7v2h3v2h2v8h-3v1H3v-1H0z"} fill={cloth} stroke="#593b2c" strokeWidth="1" />
    <path d={sitting ? "M3 2h17v1H3z" : "M6 3h5V1h7v1h3v2H6z"} fill={trim} opacity=".7" />
    {pattern === 'stripes' && <path d={sitting ? "M5 2h3v8H5zm7 0h3v8h-3z" : "M7 4h3v8H7zm7-2h3v10h-3z"} fill={trim} />}
    {pattern === 'dots' && <path d="M3 4h2v2H3zm8 2h3v2h-3zM8 2h2v2H8z" fill={trim} />}
    {pattern === 'belt' && <path d="M0 7h18v2H0zM8 6h3v4H8z" fill={trim} />}
    {pattern === 'gift' && <path d="M7 0h4v11H7zM0 5h18v2H0z" fill={trim} />}
    {pattern === 'leaf' && <path d="M8 2h2v2h3l-2 2 1 2-3-1-3 1 1-2-2-2h3z" fill={trim} />}
    {pattern === 'robe' && <path d="M2 0l7 6 7-6M3 7h12v2H3z" fill="none" stroke={trim} strokeWidth="2" />}
    {pattern === 'label' && <path d="M4 4h10v5H4z" fill={trim} />}
    {pattern === 'windows' && <path d="M2 4h3v4H2zm5 0h3v4H7zm5 0h3v4h-3z" fill={trim} />}
    {pattern === 'usc' && <path d="M2 4v4h3V4M7 4h3v2H7v2h3m2-4h3v1h-2v2h2v1h-3z" fill="none" stroke={trim} strokeWidth="1" />}
    {id === 'bee' && <path d="M6 2V0H4v-2H1v2H0v2h3v2h3zm7-2v-2h3v-1h3v2h-2v2h-4z" fill="#d5f2ed" stroke="#657d7e" strokeWidth=".5" />}
    {id === 'shrimp' && <path d="M21 4h3V2h2v2h-2v3h2v3h-3V9h-2z" fill="#f7b0a5" stroke="#944d54" strokeWidth="1" />}
    {id === 'wonder-bread' && <><path d="M5 4h2v2H5z" fill="#3d76c9" /><path d="M15 6h2v2h-2z" fill="#f2c84e" /></>}
  </g>;
}
