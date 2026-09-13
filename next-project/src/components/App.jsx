"use client";

import { useRef, useState } from "react";
import Preloader from "./Preloader/Preloader";
import Hero from "./Hero/Hero";
import WhoAreWe from "./WhoAreWe/WhoAreWe";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";


export default function App() {
  const heroRef = useRef(null);
  // Not used to unmount Preloader (its own elements just hide themselves
  // once the intro finishes) — kept in case you want to gate something
  // else in your app on the intro being done, e.g. enabling nav clicks.
  const [, setIntroDone] = useState(false);

  return (
    <>
      <Preloader heroRef={heroRef} onDone={() => setIntroDone(true)}>
        <Hero ref={heroRef} />
      </Preloader>
      <WhoAreWe></WhoAreWe>
      <WhyChooseUs />
    </>
  );
}
