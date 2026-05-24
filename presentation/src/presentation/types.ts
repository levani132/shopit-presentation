/**
 * Domain types for the presentation. The presentation is a sequence of
 * slides positioned in 3D space; the camera flies between them along a
 * smooth curve, while a separate visible "line" path threads through each
 * slide's chosen entry point.
 */

export type Vec3 = [number, number, number];

export interface SlideTransition {
  /** Duration of the camera journey TO this slide, in seconds. Default 2.2. */
  durationSec?: number;
  /** GSAP easing name. Default "power2.inOut". */
  ease?: string;
}

export interface SlideConfig {
  /** Stable id — also used by the slide-component registry. */
  id: string;

  /** Human-readable label for the slide. Shown in nav dots tooltip. */
  label: string;

  /**
   * World position the slide's content centers on. The camera animates to
   * sit directly above this point, so this also determines where the slide
   * HTML appears on screen (it appears centered).
   */
  position: Vec3;

  /**
   * Where the visible line passes through *for this slide* — where the
   * arrow stops when this slide is active. Typically offset from `position`
   * into a corner of the slide's visible area, so the arrow doesn't sit
   * on top of the slide content.
   *
   * Defaults to `position` (line passes through slide center).
   */
  linePoint?: Vec3;

  /**
   * What the camera looks at while stopped here.
   * Defaults to `position` (i.e., look directly at the slide content).
   */
  lookAt?: Vec3;

  /**
   * Offset from `position` to the camera's stopping point.
   * Defaults to [0, 0, 8] — camera 8 units above the slide plane.
   */
  cameraOffset?: Vec3;

  /** Per-slide override for the journey animation. */
  transition?: SlideTransition;
}

/**
 * Resolved slide — defaults applied. Computed once at startup; consumed by
 * the scene + camera.
 */
export interface ResolvedSlide {
  id: string;
  label: string;
  position: Vec3;
  /** Point on the visible line for this slide (arrow stops here). */
  linePoint: Vec3;
  lookAt: Vec3;
  /** Absolute world position the camera occupies when stopped here. */
  cameraStop: Vec3;
  transition: Required<SlideTransition>;
}
