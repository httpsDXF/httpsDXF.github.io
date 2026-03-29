import { Nunito, Outfit, Syncopate } from "next/font/google";

/** Wide, expanded display — Akira Expanded–style vibe (use local Akira if you license it). */
export const fontHeroDisplay = Syncopate({
  weight: ["700"],
  subsets: ["latin"],
});

/** Rounded geometric sans — Coolvetica-adjacent for the hero tagline. */
export const fontHeroTagline = Outfit({
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const fontHeroBody = Nunito({
  subsets: ["latin"],
  weight: ["700", "800"],
});
