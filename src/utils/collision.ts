import { TBoundingBox } from "@/@types/types";

/**
 * Caluculate collision between two rects,
 * and return collided rect and area.
 *
 * @param rect1Bbox Base rect
 * @param rect2Bbox Target rect
 * @returns null if not collided, or collided rect
 */
export const calcRectCollision = (
  rect1Bbox: TBoundingBox,
  rect2Bbox: TBoundingBox
): null | TBoundingBox => {
  const [[x1, y1], [x2, y2]] = [rect1Bbox[0], rect1Bbox[1]];
  const [[x3, y3], [x4, y4]] = [rect2Bbox[0], rect2Bbox[1]];

  const collided =
    Math.max(x1, x3) < Math.min(x2, x4) && Math.max(y1, y3) < Math.min(y2, y4);

  return collided
    ? [
        // collision rect
        [Math.max(x1, x3), Math.max(y1, y3)],
        [Math.min(x2, x4), Math.min(y2, y4)],
      ]
    : null;
};
