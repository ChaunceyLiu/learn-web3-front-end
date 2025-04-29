// component/Input
import React from "react";
import { Input as MuiInput, type InputProps } from "@mui/material";
import { color } from "@/constants/css";

interface CustomInputProps extends InputProps {}

export default function Input(props: CustomInputProps) {
  return (
    <MuiInput
      {...props}
      disableUnderline={true}
      sx={{
        "&.MuiInputBase-root": {
          width: "100%",
          padding: "0 24px",
        },
        "& .MuiInput-input": {
          color: "#1a1a1a",
          fontSize: "15px",
          padding: "8px 16px",
          borderRadius: "20px",
          backgroundColor: color.default,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
      className="MuiInputBase-input MuiOutlinedInput-input"
      type="text"
    />
  );
}
