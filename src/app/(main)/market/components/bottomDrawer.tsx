"use client";
import React from "react";
import { Drawer } from "@mui/material";

type DrawerChildProps = {
  onCloseDrawer?: () => void;
};

export default function BottomDrawer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer =
    (open: boolean) => () => {
      setOpen(open);
    };

  const closeDrawer = () => {
    console.log("Closing drawer from children");
    setOpen(false);
  };

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onCloseDrawer: closeDrawer,
      } as DrawerChildProps);
    }
    return child;
  });
  return (
    <div>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="z-[1500] rounded-lg bg-blue-500 px-4 py-2 text-white shadow-xl transition-colors hover:bg-blue-600"
        data-testid="toggle-button"
      >
        Select Chain
      </button>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          className: "!h-[50vh] rounded-t-3xl",
          sx: {
            overflowX: "hidden",
            overflowY: "auto",
          },
        }}
      >
        {enhancedChildren}
      </Drawer>
    </div>
  );
}
