/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Editorial palette: deep space, white path, Free Uni gold accent.
        nebula: {
          deep: "#02020a",
          ink: "#0a0d1f",
          panel: "#0e1230",
          line: "#ffffff",
          gold: "#f5c518",
          goldSoft: "#fde68a",
          mute: "rgba(255, 255, 255, 0.62)",
          rule: "rgba(255, 255, 255, 0.16)",
        },
      },
      fontFamily: {
        // Single sans family that handles Latin + Georgian gracefully.
        sans: ['"IBM Plex Sans Georgian"', "system-ui", "sans-serif"],
        // Editorial serif for the title slide hero — feels academic, not AI.
        serif: ['"Fraunces"', '"Times New Roman"', "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.32em",
      },
      animation: {
        "fade-in-up": "fadeInUp 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rule-grow": "ruleGrow 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
        // ProblemSlide split choreography. Items first fade in (animate-fade-in-up
        // on an inner wrapper), then after ~2.4s these animations on the outer
        // wrapper translate them into two columns. The split animations carry
        // `forwards` so the final state persists; their 0% matches resting state
        // so the elements look identical to plain items during the delay.
        "split-left":
          "splitLeft 1100ms cubic-bezier(0.65, 0, 0.35, 1) 2400ms forwards",
        "split-right":
          "splitRight 1100ms cubic-bezier(0.65, 0, 0.35, 1) 2400ms forwards",
        "scale-y-in": "scaleYIn 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ruleGrow: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        // ProblemSlide split: items 1-3 (infra) translate left + dim.
        splitLeft: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-170px)", opacity: "0.5" },
        },
        // Items 4-7 (differentiation) translate right AND up — they
        // occupy rows 4-7 of the initial single column and need to slide
        // up into rows 1-4 of the new right column. Each row is 56px,
        // so the up-shift is 3 × 56 = 168px (constant for all 4 items).
        splitRight: {
          "0%": { transform: "translateX(0) translateY(0)", opacity: "1" },
          "100%": {
            transform: "translateX(170px) translateY(-168px)",
            opacity: "1",
          },
        },
        scaleYIn: {
          "0%": { opacity: "0", transform: "scaleY(0)" },
          "100%": { opacity: "1", transform: "scaleY(1)" },
        },
      },
    },
  },
  plugins: [],
};
