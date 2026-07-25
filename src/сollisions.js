/**
 * collisions.js — universal 2D collision-detection utilities.
 * Framework-agnostic, no dependencies. Shapes are plain objects:
 *
 *   circle: { x, y, r }              — center + radius
 *   rect:   { x, y, width, height }  — top-left corner + size (AABB, no rotation)
 *   point:  { x, y }
 */

// ---------- distance helpers ----------

/** Euclidean distance between two points. */
export function distance(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Squared distance — use when you only need to *compare* distances, it skips the sqrt. */
export function distanceSquared(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return dx * dx + dy * dy;
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

// ---------- point tests ----------

/** True if `point` lies inside `circle` (boundary counts as inside). */
export function pointInCircle(point, circle) {
    return distanceSquared(point, circle) <= circle.r * circle.r;
}

/** True if `point` lies inside `rect` (boundary counts as inside). */
export function pointInRect(point, rect) {
    return (
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height
    );
}

// ---------- shape vs shape tests ----------

/** True if two circles overlap or touch. */
export function circleIntersectsCircle(a, b) {
    const rSum = a.r + b.r;
    return distanceSquared(a, b) <= rSum * rSum;
}

/** True if two axis-aligned rects overlap or touch. */
export function rectIntersectsRect(a, b) {
    return (
        a.x <= b.x + b.width &&
        a.x + a.width >= b.x &&
        a.y <= b.y + b.height &&
        a.y + a.height >= b.y
    );
}

/**
 * True if a circle and an axis-aligned rect overlap or touch.
 * Finds the closest point on the rect to the circle's center, then checks
 * whether that point is within the radius — works whether the center is
 * outside the rect, inside it, or the circle only clips a corner.
 */
export function circleIntersectsRect(circle, rect) {
    const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy <= circle.r * circle.r;
}

// ---------- overlap / resolution info ----------

/**
 * Circle-vs-circle overlap details, or null if they don't intersect.
 * `depth` — how far they overlap along the line connecting their centers.
 * `normal` — unit vector pointing from `a` toward `b`, i.e. the direction
 * you'd push `b` to separate them (push `a` the opposite way).
 * Useful for simple physics response (bubble-bubble bounce, etc).
 */
export function getCircleOverlap(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    const rSum = a.r + b.r;
    if (dist >= rSum) return null;

    const depth = rSum - dist;
    // centers coincide exactly — pick an arbitrary separation axis
    const normal = dist === 0 ? { x: 1, y: 0 } : { x: dx / dist, y: dy / dist };
    return { depth, normal };
}

/**
 * Circle-vs-rect overlap details, or null if they don't intersect.
 * `depth` — how far the circle pokes into the rect from its closest edge.
 * `normal` — unit vector pointing from the rect's closest point toward the
 * circle's center, i.e. the direction to push the circle to separate them.
 */
export function getCircleRectOverlap(circle, rect) {
    const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    const dist = Math.hypot(dx, dy);
    if (dist >= circle.r) return null;

    const depth = circle.r - dist;
    const normal = dist === 0 ? { x: 0, y: -1 } : { x: dx / dist, y: dy / dist };
    return { depth, normal };
}

// ---------- swept (fast-moving object) collision ----------

/**
 * Swept circle-vs-circle test for fast-moving objects, where a plain
 * end-of-frame check could miss the collision entirely ("tunneling")
 * because the object moved past the target within a single frame.
 *
 * `a` moves from (a.x, a.y) by (dx, dy) this frame; `b` is stationary.
 * Returns the fraction of the movement `t` (0..1) at which contact first
 * happens, or null if they never touch during this frame's movement.
 */
export function sweptCircleVsCircle(a, dx, dy, b) {
    // treat it as a ray from `a`'s start position against a circle of
    // radius (a.r + b.r) centered on `b` — a standard ray/circle test
    const rSum = a.r + b.r;
    const fx = a.x - b.x;
    const fy = a.y - b.y;

    const A = dx * dx + dy * dy;
    const B = 2 * (fx * dx + fy * dy);
    const C = fx * fx + fy * fy - rSum * rSum;

    if (A === 0) {
        // not moving — fall back to a static check
        return C <= 0 ? 0 : null;
    }

    const discriminant = B * B - 4 * A * C;
    if (discriminant < 0) return null; // ray never reaches the circle

    const sqrtDisc = Math.sqrt(discriminant);
    const t1 = (-B - sqrtDisc) / (2 * A);
    const t2 = (-B + sqrtDisc) / (2 * A);

    // first entry point that actually falls within this frame's movement
    if (t1 >= 0 && t1 <= 1) return t1;
    if (t2 >= 0 && t2 <= 1) return t2; // started already overlapping
    return null;
}