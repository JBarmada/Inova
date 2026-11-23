import { z } from "zod";

export const boundsSchema = z.object({
  x: z.number().finite(), y: z.number().finite(),
  width: z.number().finite().positive(), height: z.number().finite().positive(),
  maximized: z.boolean(),
});
export const layoutSchema = z.object({
  version: z.literal(1), home: boundsSchema.optional(), floating: boundsSchema.optional(),
});
export type Bounds = z.infer<typeof boundsSchema>;
export type WindowLayout = z.infer<typeof layoutSchema>;
type WorkArea = { position: { x: number; y: number }; size: { width: number; height: number } };

export const FLOAT_WIDTH = 248;
export const FLOAT_HEIGHT = 208;

export function visiblePosition(bounds: Bounds, size: { width: number; height: number }, areas: WorkArea[]) {
  const area = areas.find(({ position: p, size: s }) => bounds.x >= p.x && bounds.x < p.x + s.width && bounds.y >= p.y && bounds.y < p.y + s.height) ?? areas[0];
  if (!area) return { x: bounds.x, y: bounds.y };
  return {
    x: Math.min(Math.max(bounds.x, area.position.x), area.position.x + Math.max(0, area.size.width - size.width)),
    y: Math.min(Math.max(bounds.y, area.position.y), area.position.y + Math.max(0, area.size.height - size.height)),
  };
}
