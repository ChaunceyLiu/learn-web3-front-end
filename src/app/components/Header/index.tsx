// components/Header/index.tsx
"use client";
import CustomTabs from "../CustomTabs";
import Image from "next/image";
export default function Header() {

  return (
    <nav className="flex w-full flex-row items-center justify-between px-4 py-3">
      <Image
        src={"/menu.png"}
        alt="menu"
        width={34}
        height={34}
        priority
      ></Image>
      <CustomTabs />

      <Image src={"/Avatar.png"} alt="menu" width={34} height={34}></Image>
    </nav>
  );
}
