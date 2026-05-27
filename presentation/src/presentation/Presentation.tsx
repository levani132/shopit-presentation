import { useMemo } from "react";
import { SpaceScene } from "@/scene/SpaceScene";
import { JourneyPath } from "@/scene/JourneyPath";
import { PathArrow } from "@/scene/PathArrow";
import { CameraRig } from "@/scene/CameraRig";
import { SlideStage } from "@/scene/SlideStage";
import {
  SlideNavigationContext,
  SlideNavigationProvider,
  useSlideNavigation,
} from "@/navigation/SlideNavigationContext";
import { useKeyboardShortcuts } from "@/navigation/useKeyboardShortcuts";
import { NavigationOverlay } from "@/navigation/NavigationOverlay";
import { useCameraJourney } from "@/camera/useCameraJourney";
import { buildJourneyCurves, type JourneyCurves } from "@/camera/buildJourneyCurve";
import { resolveSlides } from "./resolveSlides";
import { slidesConfig } from "./slides.config";
import { getSlideComponent } from "./slides";

/**
 * Top-level orchestrator. Resolves slide data once, builds both journey
 * curves (camera + visible line), then mounts the navigation provider
 * around the actual view.
 */
export function Presentation() {
  const resolvedSlides = useMemo(() => resolveSlides(slidesConfig), []);
  const curves = useMemo(
    () => buildJourneyCurves(resolvedSlides),
    [resolvedSlides],
  );

  return (
    <SlideNavigationProvider slides={resolvedSlides}>
      <PresentationView curves={curves} />
    </SlideNavigationProvider>
  );
}

interface PresentationViewProps {
  curves: JourneyCurves;
}

/**
 * Consumes the navigation context, drives the camera, mounts the 3D scene
 * and the on-screen overlay.
 */
function PresentationView({ curves }: PresentationViewProps) {
  // Grab the FULL navigation value (not just destructured fields) so we can
  // re-provide it inside the Canvas via the context bridge below.
  const navigation = useSlideNavigation();
  const { slides, currentIndex, setTransitioning } = navigation;
  const progressRef = useCameraJourney(slides, currentIndex, setTransitioning);
  useKeyboardShortcuts();

  return (
    <>
      <SpaceScene>
        {/* R3F Canvas runs a separate React reconciler, so context providers
            from outside the Canvas are not visible to components rendered
            inside (even via drei's <Html> portal). We re-provide the same
            navigation value here so useSlideSteps inside slide bodies can
            read it. */}
        <SlideNavigationContext.Provider value={navigation}>
          <JourneyPath curve={curves.lineCurve} />
          <PathArrow
            curve={curves.lineCurve}
            progressRef={progressRef}
            totalSlides={slides.length}
          />
          <CameraRig
            slides={slides}
            cameraCurve={curves.cameraCurve}
            progressRef={progressRef}
          />
          {slides.map((slide, idx) => {
            const SlideBody = getSlideComponent(slide.id);
            if (!SlideBody) {
              if (import.meta.env.DEV) {
                console.warn(
                  `[Presentation] Slide id "${slide.id}" has no component in the registry.`,
                );
              }
              return null;
            }
            return (
              <SlideStage
                key={slide.id}
                slide={slide}
                slideIndex={idx}
                progressRef={progressRef}
                component={SlideBody}
              />
            );
          })}
        </SlideNavigationContext.Provider>
      </SpaceScene>
      <NavigationOverlay />
    </>
  );
}
