"use client";
import Input from "@/components/BaseInput";
import ChainPanel from "@/app/components/ChainPanel";
import { Button } from "@mui/material";

export default function Wallet() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex w-full flex-row items-center justify-between px-4 pt-6">
        <Input placeholder="搜索币对"></Input>
        <Button
          variant="text"
          sx={{
            color: "#fff", // 主颜色
            "&:hover": { color: "#fff" }, // 悬停
            "&.Mui-focusVisible": { color: "#fff" }, // 聚焦
          }}
        >
          搜索
        </Button>
      </div>

      <div className="container flex flex-col items-center justify-center p-4">
        <ChainPanel></ChainPanel>
      </div>
    </main>
  );
}
