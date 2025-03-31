// components/Header.jsx
import Image from "next/image";
export default function Header() {
  return (
    <nav className="flex flex-row items-center justify-between px-9 py-3 w-full">
      {/* 导航内容 */}
      <Image src={"/menu.png"} alt="menu" width={34} height={34}></Image>
      <Image src={"/Avatar.png"} alt="menu" width={34} height={34}></Image>
    </nav>
  );
}
