import type { FC, ReactNode } from "react";
import React from "react";

interface Props {
  title: string;
  padding?: string;
  background?: string;
  children?: ReactNode;
}

export const DemoBlock: FC<Props> = ({
  title,
  padding = "12px 12px",
  background = "var(--adm-color-background)",
  children,
}) => {
  return (
    <div className="mb-3 last:mb-0 last:pb-8">
      <div className="pt-3 pr-3 pb-2 pl-3 text-sm text-[#697b8c] dark:text-[#959da6] bg-gray-100">
        {title}
      </div>
      <div
        className="border-x-0"
        style={{
          padding,
          background,
        }}
      >
        {children}
      </div>
    </div>
  );
};