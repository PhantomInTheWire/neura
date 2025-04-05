import Link from "next/link";
import { Button } from "@/components/ui";
import Theme from "./Theme";
import NavLinks from "./NavLinks";

export function Navbar() {
  return (
    <>
      <header className="w-full flex items-center justify-between px-36 py-3 border-b-[1px] fixed top-0 z-40 backdrop-blur-md">
        <div className="glass-effect w-full h-full absolute left-0 -z-10" />
        {/* border-[#f6f6f6] */}
        <div className="flex items-center gap-8">
          <Link
            href="#home"
            className="nav-link text-[1.8rem] font-semibold text-primary"
          >
            Neura
          </Link>
          <NavLinks />
        </div>

        <div className="flex gap-8">
          <Theme />
          <Link href="/w">
            <Button className="rounded-full">Get Started</Button>
          </Link>
        </div>
      </header>
      {/* Glass effect */}
      <svg className="w-full h-16 fixed top-0 -z-10">
        <defs>
          <filter id="fractal-noise-glass">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.12 0.12"
              numOctaves="1"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="30"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}
