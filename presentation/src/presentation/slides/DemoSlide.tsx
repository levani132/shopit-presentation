import { useEffect, useRef, useState } from "react";
import { SlideCard } from "@/ui/SlideCard";
import { ShopItMark } from "@/ui/ShopItMark";
import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Demo slide — two visual states, both filling the ENTIRE SlideCard:
 *
 *   step 0  →  title state: an eyebrow ("დემო · 02") at top-left, a giant
 *              centered "დემო" wordmark, and a thin gold rule beneath it.
 *              No inner panel, no background of its own — the SlideCard's
 *              natural background carries the moment, so there's no
 *              color seam between the title area and the card.
 *   step 1  →  the entire title (eyebrow included) slides up and fades
 *              out; the video reveals underneath, filling the SlideCard
 *              edge-to-edge. In the video's final ~0.5s an outro card
 *              fades in over the footage with the ShopIt mark.
 *
 * Why we render a custom eyebrow instead of passing `eyebrow` to SlideCard:
 *   the SlideCard's own eyebrow lives in normal flow, can't be transformed
 *   independently, and stays visible behind the absolute-positioned video.
 *   Putting the eyebrow inside the title overlay lets it exit with the
 *   rest of the title state and lets the video truly fill the whole card.
 */

const VIDEO_SRC = "/demo.mov";
// How many seconds before the video's end we cross-fade the outro in.
const OUTRO_LEAD_SECONDS = 0.45;

// Crop control. The video element is visually scaled via `transform: scale`
// anchored to the top-left. The top-left of the recording stays glued to
// the slide's top-left corner, while the bottom and the right edge (where
// the recording's browser scrollbar lives) extend past the container and
// get clipped by overflow-hidden. Bump this if any scrollbar is still
// visible at the right edge.
//
// Using `transform: scale` rather than an oversized width is important —
// transforms don't participate in document layout, so the page can't
// accidentally develop horizontal overflow from the visible element.
const VIDEO_CROP_SCALE = 1.1;

export function DemoSlide() {
  const step = useSlideSteps(2);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [outroVisible, setOutroVisible] = useState(false);

  // Drive video playback off the slide's reveal step.
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;

    if (step >= 1) {
      v.currentTime = 0;
      const playPromise = v.play();
      if (playPromise) playPromise.catch(() => undefined);
      if (a) {
        a.currentTime = 0;
        a.volume = 0.5;
        const ap = a.play();
        if (ap) ap.catch(() => undefined);
      }
    } else {
      v.pause();
      v.currentTime = 0;
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
      setOutroVisible(false);
    }
  }, [step]);

  function handleTimeUpdate(event: React.SyntheticEvent<HTMLVideoElement>) {
    const v = event.currentTarget;
    if (!Number.isFinite(v.duration) || v.duration <= 0) return;
    const remaining = v.duration - v.currentTime;
    if (remaining < OUTRO_LEAD_SECONDS && !outroVisible) {
      setOutroVisible(true);
      const a = audioRef.current;
      if (a) {
        const fadeOut = setInterval(() => {
          if (!a) return;
          a.volume = Math.max(0, a.volume - 0.05);
          if (a.volume === 0) clearInterval(fadeOut);
        }, 50);
      }
    }
  }

  return (
    // No `eyebrow` prop — the title overlay below renders its own so it can
    // animate out with the rest of the title state.
    // `xl` size — the demo card runs taller than the rest of the deck so
    // the screen recording has room to breathe.
    <SlideCard size="xl">
      {/* Single full-bleed wrapper. Sits at inset-0 of the SlideCard's
          article (which is `relative`), so its three layers fill the
          entire card box including the padding area. Clipped to the
          card's rounded corners. */}
      <div className="absolute inset-0 overflow-hidden rounded-sm">
        {/* Layer 1 — the video. Hidden under the title in step 0, visible
            in step 1, then cross-faded OUT as the outro fades in (so the
            outro can read on the card's natural background instead of
            needing its own opaque bg).

            Crop strategy: the video element is sized WIDER than its
            container (width: 100% + VIDEO_RIGHT_CROP_PERCENT) and anchored
            to top-left. object-cover with object-position: left top fills
            the box while keeping the top of the recording (the navigation
            header) flush with the top of the slide. Vertical excess from
            cover is shunted to the bottom (less important than the
            header). The right edge of the video — where the scrollbar
            sits — extends past the container's right edge and is clipped
            by the wrapper's overflow-hidden. */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "left top",
            transform: `scale(${VIDEO_CROP_SCALE})`,
            transformOrigin: "top left",
            opacity: step >= 1 && !outroVisible ? 1 : 0,
            transition: "opacity 600ms ease",
          }}
        />

        {/* Layer 2 — the title state. No background of its own; the
            SlideCard's bg shows through, so step 0 looks like one
            continuous surface. Slides up and fades on step 1. */}
        <div
          className="absolute inset-0"
          style={{
            opacity: step >= 1 ? 0 : 1,
            transform: step >= 1 ? "translateY(-40px)" : "translateY(0)",
            transition:
              "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: step >= 1 ? "none" : "auto",
          }}
        >
          {/* Eyebrow — positioned to match SlideCard's standard eyebrow
              location (px-16 = 64px, py-14 = 56px). */}
          <p
            className="absolute font-mono uppercase tracking-eyebrow text-nebula-gold"
            style={{
              top: "56px",
              left: "64px",
              fontSize: "18px",
            }}
          >
            დემო · 02
          </p>

          {/* Centered wordmark + thin gold rule beneath it. */}
          <div className="flex h-full flex-col items-center justify-center">
            <p className="font-serif text-[170px] font-semibold leading-none text-white">
              დემო
            </p>
            <span
              aria-hidden
              className="mt-8 block h-[2px] w-24 bg-nebula-gold"
            />
          </div>
        </div>

        {/* Layer 3 — the outro card. NO background of its own; instead the
            video underneath cross-fades to transparent at the same time,
            so the outro reads on the SlideCard's natural surface (same
            visual treatment as the title state in step 0). */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            opacity: outroVisible ? 1 : 0,
            transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: outroVisible ? "auto" : "none",
          }}
        >
          <ShopItMark size={140} />
          <span
            aria-hidden
            className="mt-6 block h-[2px] w-24 bg-nebula-gold"
          />
          <p className="mt-6 text-[30px] text-white/85">მაღაზია წუთებში</p>
        </div>
      </div>

      <audio ref={audioRef} src="/demo-music.mp3" preload="auto" />
    </SlideCard>
  );
}
