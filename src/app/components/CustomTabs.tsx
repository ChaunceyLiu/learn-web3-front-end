// components/CustomTabs.jsx
"use client";
import { Tabs, Tab } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

const TAB_CONFIG = [
  { label: "交易所", path: "/" },
  { label: "Web3钱包", path: "/wallet" },
];

export default function CustomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = useMemo(() => {
    const index = TAB_CONFIG.findIndex((tab) => tab.path === pathname);
    return index !== -1 ? index : 0; // 默认选中第一个标签
  }, [pathname]);

  const createTabStyling = (index: number) => ({
    backgroundColor: activeIndex === index ? "#fff" : "#f3f3f3",
    "&:hover": { backgroundColor: "#6366f1" },
    transition: "all 0.3s ease",
  });

  return (
    <Tabs
      value={activeIndex}
      slotProps={{
        indicator: { style: { display: "none" } },
      }}
      onChange={(_, newValue) => {
        const tab = TAB_CONFIG[newValue];
        if (tab) router.push(tab.path);
      }}
      sx={{
        "& .MuiTabs-indicator": { backgroundColor: "#4f46e5" },
        "& .MuiTab-root": {
          minWidth: 100,
          borderRadius: 20,
          padding: 0,
          minHeight: 36,
          border: 0,
          color: "#929292",
          "&.Mui-selected": {
            color: "#333",
            backgroundColor: "#fff",
            "&:hover": { backgroundColor: "#fff" },
          },
        },
        "&.MuiTabs-root": {
          backgroundColor: "#f3f3f3",
          minHeight: 36,
          padding: "2px 4px",
          borderRadius: 20,
        },
      }}
    >
      {TAB_CONFIG.map((tab, index) => (
        <Tab
          key={tab.path}
          label={tab.label}
          sx={createTabStyling(index)}
          disableRipple
        />
      ))}
    </Tabs>
  );
}
