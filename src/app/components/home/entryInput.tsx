// component/Input
'use client';
import React from "react";
import { useRouter } from "next/navigation";
import BaseInput from "../BaseInput";

export default function EntryInput() {
  const router = useRouter();
  const handleClick = (event: React.MouseEvent) => {
    router.push("/search");
  };
  return <BaseInput placeholder="搜索币对" onClick={handleClick} />;
}
