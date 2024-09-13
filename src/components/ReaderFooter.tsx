import React from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { control } from "../helpers/control";

export const ReaderFooter = () => {
  return (
    <>
      <footer id="bottom-bar" aria-label="Bottom Bar">
        <IconButton
          title="Go left"
          onClick={() => {
            control("goLeft")
          }}
        >
          <ArrowBackIcon></ArrowBackIcon>
        </IconButton>
        <IconButton
          title="Go right"
          onClick={() => {
            control("goRight")
          }}
        >
          <ArrowForwardIcon></ArrowForwardIcon>
        </IconButton>
      </footer>
    </>);
}