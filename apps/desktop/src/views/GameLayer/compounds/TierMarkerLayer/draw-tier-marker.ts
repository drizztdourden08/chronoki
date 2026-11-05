/* @layer renderer-components @kind logic */
import { BOB_PERIOD_MS, BOB_PX, GLOW_COLORS, STAR_COLORS, STAR_POINTS } from './TierMarkerLayer.constants';
import type { MarkerShape, TierMarkerSpot } from './TierMarkerLayer.type';

const starPath = (ctx: CanvasRenderingContext2D, x: number, y: number, outer: number): void => {
  ctx.beginPath();
  for (let i = 0; i < STAR_POINTS * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : outer * 0.45;
    const angle = -Math.PI / 2 + (i * Math.PI) / STAR_POINTS;
    ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  ctx.closePath();
};

const drawStar = ({ ctx, x, y, size, color }: MarkerShape): void => {
  starPath(ctx, x, y, size / 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = Math.max(1, size / 8);
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
};

const drawGlow = ({ ctx, x, y, size, color }: MarkerShape): void => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
};

const drawTierMarker = (ctx: CanvasRenderingContext2D, spot: TierMarkerSpot, time: number): void => {
  const bob = Math.sin((time / BOB_PERIOD_MS) * Math.PI * 2) * BOB_PX * (spot.size / 10);
  const y = spot.y + bob;
  const star = STAR_COLORS[spot.tier];
  const glow = GLOW_COLORS[spot.tier];
  if (star) drawStar({ ctx, x: spot.x, y, size: spot.size, color: star });
  else if (glow) drawGlow({ ctx, x: spot.x, y, size: spot.size * 1.3, color: glow });
};

export { drawTierMarker };
