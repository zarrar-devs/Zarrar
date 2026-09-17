"use client";

import { useRef, useState } from "react";
import SmoothScrollProvider from "./WhoAreWe/SmoothScrollProvider";
import Preloader from "./Preloader/Preloader";
import Hero from "./Hero/Hero";
import WhoAreWe from "./WhoAreWe/WhoAreWe";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";


export default function App() {
  const heroRef = useRef(null);
  const [, setIntroDone] = useState(false);

  return (
    <SmoothScrollProvider>
      <Preloader heroRef={heroRef} onDone={() => setIntroDone(true)}>
        <Hero ref={heroRef} />
      </Preloader>
      <WhoAreWe></WhoAreWe>
      <WhyChooseUs />
    </SmoothScrollProvider>
  );
}