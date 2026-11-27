import type { CostumeDesign } from './costumeDesigns';

type HatProps = { kind?: string; color: string; trim: string };
export function CostumeHat({ kind, color, trim }: HatProps) {
  const dark = '#4b3029';
  if (!kind || kind === 'scar') return kind === 'scar' ? <path d="M11 3h2l-1 3h2l-3 4 1-3h-2z" fill="#b14b47" /> : null;
  if (kind === 'bob') return <path d="M-3 4V0H0v-4h3v-2h13v2h3v4h3v5h-3V1H1v4z" fill={color} stroke={dark} strokeWidth="1" />;
  if (kind === 'crown') return <><path d="M0 3v-7h4l3 3 3-5 3 5 3-3h3v7z" fill={trim} stroke={dark} /><path d="M-2 4h23v2H-2z" fill={color} /></>;
  if (kind === 'mushroom') return <><path d="M-3 4v-5l3-4h3v-2h13v2h3l3 4v5z" fill="#fff9ee" stroke={dark} /><path d="M3-3h5v4H3zm9-2h5v4h-5z" fill={color} /></>;
  if (kind === 'ears' || kind === 'ogre') return <><path d="M0 3L-2-7h4l4 8M14 1l4-8h4L20 3" fill={color} stroke={dark} /><path d="M0-4h2M18-4h2" stroke={trim} strokeWidth="2" /></>;
  if (kind === 'antennae') return <><path d="M5 3V-5m10 8v-8" stroke={dark} /><path d="M3-8h4v3H3zm10 0h4v3h-4z" fill={trim} stroke={dark} /></>;
  if (kind === 'party') return <><path d="M3 3L9-8h3l6 11z" fill={color} stroke={dark} /><path d="M8-2h3v2H8zM4 2h13v2H4z" fill={trim} /></>;
  if (kind === 'cap' || kind === 'beanie' || kind === 'helmet' || kind === 'towel') return <><path d="M0 3v-4l3-4h13l3 4v4z" fill={color} stroke={dark} /><path d="M-2 3h22v2H-2z" fill={trim} />{kind === 'helmet' && <path d="M5-6v-3h10v3z" fill="#ad3737" />}</>;
  if (kind === 'bows' || kind === 'bow') return <path d="M2-5h5l3 3 3-3h5v6h-5l-3-2-3 2H2z" fill={trim} stroke={dark} />;
  if (kind === 'hood') return <path d="M-3 5V0l3-5h3v-2h13v2h3l3 5v5h-3V1l-3-3H3L0 1v4z" fill={color} stroke={trim} />;
  if (kind === 'eyes') return <><path d="M3-6h5v5H3zm9 0h5v5h-5z" fill="#fff5df" stroke={dark} /><path d="M5-4h2v2H5zm9 0h2v2h-2z" fill={dark} /></>;
  if (kind === 'bottle') return <path d="M6 3V-5h2v-4h5v4h2v8z" fill={color} stroke={dark} />;
  if (kind === 'roof') return <path d="M-2 3L9-5h3L22 3z" fill={color} stroke={dark} />;
  if (kind === 'leaves' || kind === 'leaf' || kind === 'flower' || kind === 'fluff' || kind === 'feathers') return <><path d="M-3 4l1-5 5 1 2-5 5 2 4-4 3 5 5-1 1 5-4 3H1z" fill={color} stroke={dark} /><path d="M4-1h3v2H4zm8-3h3v2h-3z" fill={trim} /></>;
  return null;
}

export function CostumeFace({ kind, color }: { kind?: CostumeDesign['face']; color: string }) {
  if (kind === 'mustache') return <path d="M-6 4h4v2h3v-2h4v2h3V4h4v3h-2v2H5L3 7 1 9h-5l-2-2z" fill={color} stroke="#503328" strokeWidth=".5" />;
  if (kind === 'nose') return <rect x="2" y="2" width="4" height="3" fill="#d84d42" />;
  if (kind === 'cheeks') return <path d="M-7 3h3v2h-3zm17 0h3v2h-3z" fill="#e76669" />;
  if (kind === 'glasses' || kind === 'cucumber') return <><path d="M-7-2h5l1 1v4l-1 1h-5l-1-1v-4zm11 0h5l1 1v4L9 4H4L3 3v-4zm-5 2h4" fill={kind === 'cucumber' ? '#a8d489' : 'none'} stroke={kind === 'cucumber' ? '#5a914f' : '#4b3029'} strokeWidth="1" /></>;
  return null;
}
