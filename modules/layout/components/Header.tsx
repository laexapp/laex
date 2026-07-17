"use client";

import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Header() {

  return (

    <header
      className="
        sticky
        top-0
        z-50
        w-full
        bg-[#05070D]/95
        backdrop-blur-2xl
      "
    >

      <div
        className="
          flex
          h-16
          w-full
          items-center
          justify-between
          px-8
          xl:px-12
        "
      >

        <Logo />

        <Navigation />

      </div>

    </header>

  );

}