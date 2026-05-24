import { useEffect, useRef, useState } from "react";
import { SlideCard } from "@/ui/SlideCard";
import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Demo slide — three visual states inside a single card "screen":
 *
 *   step 0  →  black title state: a large "დემო" wordmark sits over the
 *              video, which is paused at frame 0 underneath.
 *   step 1  →  the title card slides off (up + fade); the video plays.
 *              In the video's final ~0.5s an outro card fades in over the
 *              footage, showing the ShopIt mark + "მაღაზია წუთებში".
 *
 * The slide advances on next-press only when in step 1, so the audience
 * can read the title before the video starts. Stepping back to 0 pauses
 * and rewinds the clip — going back and forth re-runs the demo cleanly.
 *
 * The .mov asset lives at /demo.mov (Vite serves anything in /public at
 * the root path). It plays muted so browsers honour autoplay; an optional
 * `<audio>` track can be layered on top (see the commented stub at the
 * bottom of this file).
 */

const VIDEO_SRC = "/demo.mov";
// How many seconds before the video's end we cross-fade the outro in.
const OUTRO_LEAD_SECONDS = 0.45;

export function DemoSlide() {
  const step = useSlideSteps(2);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [outroVisible, setOutroVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Drive video playback off the slide's reveal step.
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;

    if (step >= 1) {
      // Restart from the beginning each time the user enters step 1.
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

  // Cross-fade the outro over the last ~half-second of the clip.
  function handleTimeUpdate(event: React.SyntheticEvent<HTMLVideoElement>) {
    const v = event.currentTarget;
    if (!Number.isFinite(v.duration) || v.duration <= 0) return;
    const remaining = v.duration - v.currentTime;
    if (remaining < OUTRO_LEAD_SECONDS && !outroVisible) {
      setOutroVisible(true);
      // Begin audio fade-out too, if any is wired up.
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
    <SlideCard eyebrow="დემო · 02" size="lg">
      {/* The "screen" — the area where intro / video / outro cross-fade.
          Aspect ratio is tuned for a 16:9 screen recording inside an lg
          slide card; tweak height if your recording is differently sized. */}
      <div className="relative mx-auto mt-6 overflow-hidden rounded-md ring-1 ring-nebula-rule"
           style={{ aspectRatio: "16 / 9", width: "100%", maxWidth: "1280px" }}>
        {/* Base layer — the actual recording. */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 h-full w-full bg-nebula-deep object-contain"
        />

        {/* Intro title card — covers the video at step 0, slides off at step 1. */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-nebula-deep"
          style={{
            opacity: step >= 1 ? 0 : 1,
            transform: step >= 1 ? "translateY(-32px)" : "translateY(0)",
            transition:
              "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: step >= 1 ? "none" : "auto",
          }}
        >
          <p className="font-serif text-[180px] font-semibold leading-none text-white">
            დემო
          </p>
          <span
            aria-hidden
            className="mt-10 block h-[2px] w-24 bg-nebula-gold"
          />
          <p className="mt-8 text-[26px] text-white/55">
            {videoReady
              ? "გადადით შემდეგ ნაბიჯზე →"
              : "ვიდეო იტვირთება…"}
          </p>
        </div>

        {/* Outro card — fades over the video in its final moments. */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-nebula-deep"
          style={{
            opacity: outroVisible ? 1 : 0,
            transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: outroVisible ? "auto" : "none",
          }}
        >
          <p className="font-serif text-[120px] font-semibold leading-none tracking-tight text-white">
            ShopIt
          </p>
          <span
            aria-hidden
            className="mt-8 block h-[2px] w-24 bg-nebula-gold"
          />
          <p className="mt-8 text-[32px] text-white/85">
            მაღაზია წუთებში
          </p>
        </div>
      </div>

      <audio ref={audioRef} src="/demo-music.mp3" preload="auto" />
    </SlideCard>
  );
}
