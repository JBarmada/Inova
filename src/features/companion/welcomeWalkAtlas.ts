import { WALK_ATLAS } from './welcomeWalk';

export type WalkAtlasStatus = 'loading' | 'ready' | 'error';
export const walkAtlasIsVisible = (status: WalkAtlasStatus, reduced: boolean) => status === 'ready' && !reduced;

export function loadWelcomeWalkAtlas(
  complete: (status: 'ready' | 'error') => void,
  createImage: () => HTMLImageElement = () => new Image(),
) {
  const image = createImage();
  let done = false;
  function finish(status: 'ready' | 'error') {
    if (done) return;
    done = true;
    clearTimeout(timeout);
    complete(status);
  }
  const timeout = setTimeout(() => finish('error'), 3000);
  image.onload = () => finish('ready');
  image.onerror = () => finish('error');
  image.src = WALK_ATLAS;
  return () => { done = true; clearTimeout(timeout); image.onload = null; image.onerror = null; };
}

