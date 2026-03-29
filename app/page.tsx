import { HeroHome } from "./components/HeroHome";
import { SiteHeader } from "./components/SiteHeader";
import { fontHeroBody, fontHeroDisplay, fontHeroTagline } from "./fonts";

export default function Home() {
  return (
    <div className="relative min-h-dvh w-full bg-black">
      <HeroHome
        displayFontClass={fontHeroDisplay.className}
        bodyFontClass={fontHeroBody.className}
        taglineFontClass={fontHeroTagline.className}
      />
      <div className="absolute inset-x-0 top-0">
        <SiteHeader />
      </div>
    </div>
  );
}
