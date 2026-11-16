/**
 * Avatar utility helper for consistent user avatars across Somma UI.
 * Standardizes on DiceBear 10.x triangles collection with unique patterns and B&W colors.
 * No custom avatar uploads.
 */

export function getUserAvatarUrl(userName?: string | null): string {
  const cleanName = userName?.trim() || 'Learner';
  return `https://api.dicebear.com/10.x/triangles/svg?seed=${encodeURIComponent(cleanName)}`;
}

/**
 * Generates an inline SVG data URI with geometric black and white / grayscale patterns for offline/fallback use.
 */
export function getUniqueTriangleSvg(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const l1 = 15 + Math.abs(hash % 30);
  const l2 = 50 + Math.abs((hash >> 3) % 40);
  const l3 = 80 + Math.abs((hash >> 6) % 18);
  const bg = Math.abs(hash % 2) === 0 ? '#09090b' : '#18181b';
  const c1 = `hsl(0, 0%, ${l1}%)`;
  const c2 = `hsl(0, 0%, ${l2}%)`;
  const c3 = `hsl(0, 0%, ${l3}%)`;
  const stroke = Math.abs(hash % 2) === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.3)';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <rect width="100" height="100" fill="${bg}"/>
    <circle cx="50" cy="50" r="45" fill="none" stroke="${stroke}" stroke-dasharray="3,3" opacity="0.4"/>
    <polygon points="10,90 50,15 90,90" fill="${c1}" stroke="${stroke}" stroke-width="0.75" opacity="0.9"/>
    <polygon points="50,15 90,90 15,55" fill="${c2}" stroke="${stroke}" stroke-width="0.75" opacity="0.8"/>
    <polygon points="30,80 70,30 85,85" fill="${c3}" stroke="${stroke}" stroke-width="0.75" opacity="0.75"/>
    <line x1="10" y1="90" x2="90" y2="90" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
