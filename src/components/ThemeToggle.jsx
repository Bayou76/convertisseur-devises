import React, { useContext } from "react";
import { ColorModeContext } from "../theme/themeProvider";
import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";

export default function ToggleColorMode() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <IconButton onClick={colorMode.toggleColorMode} color="inherit" aria-label="toggle dark mode">
      {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
