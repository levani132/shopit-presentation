import type { ComponentType } from "react";
import { TitleSlide } from "./TitleSlide";
import { ProblemSlide } from "./ProblemSlide";
import { DemoSlide } from "./DemoSlide";
import { MarketOpportunitySlide } from "./MarketOpportunitySlide";
import { ForeignBenchmarksSlide } from "./ForeignBenchmarksSlide";
import { LocalCompetitorsSlide } from "./LocalCompetitorsSlide";
import { SellerFindingsSlide } from "./SellerFindingsSlide";

/**
 * Registry mapping slide id (from slides.config.ts) to its content component.
 *
 * Why a registry rather than embedding components inline in the config?
 * - Keeps `slides.config.ts` plain data (easy to edit, easy to lint).
 * - One obvious place to add a new slide component.
 * - The registry is type-checked at the call site (see SlideRenderer).
 *
 * The earlier `MarketSlide` and `ArchitectureSlide` files remain on disk
 * as reference patterns (BulletList usage, multi-column grid) but are not
 * registered here — they were initial sketches superseded by the four-slide
 * review batch (title → problem → demo → marketOpportunity).
 */
export const slideRegistry: Readonly<Record<string, ComponentType>> = {
  title: TitleSlide,
  problem: ProblemSlide,
  demo: DemoSlide,
  marketOpportunity: MarketOpportunitySlide,
  foreignBenchmarks: ForeignBenchmarksSlide,
  localCompetitors: LocalCompetitorsSlide,
  sellerFindings: SellerFindingsSlide,
};

export function getSlideComponent(id: string): ComponentType | undefined {
  return slideRegistry[id];
}
