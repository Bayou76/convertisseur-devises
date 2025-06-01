import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createContext, useMemo, useState } from "react";

// Contexte pour gérer le mode clair/sombre à travers toute l’application
export const ColorModeContext = createContext();

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  // Fonction pour basculer entre les deux thèmes
  const colorMode = {
    toggleColorMode: () => {
      setMode((prev) => (prev === "light" ? "dark" : "light"));
    },
  };

  // Thème personnalisé, recalculé uniquement quand le mode change
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // Thème clair
                primary: {
                  main: "#1565c0", // bleu principal
                  light: "#bbdefb",
                  dark: "#0d47a1",
                },
                background: {
                  default: "#f0f4ff",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#0d47a1",
                  secondary: "#555",
                },
              }
            : {
                // Thème sombre
                primary: {
                  main: "#90caf9", // bleu clair
                  light: "#e3f2fd",
                  dark: "#42a5f5",
                },
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
                text: {
                  primary: "#e3f2fd",
                  secondary: "#bbb",
                },
              }),
        },

        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 700,
          },
          h6: {
            fontWeight: 600,
          },
          caption: {
            fontSize: "0.75rem",
            color: "text.secondary",
          },
        },

        // Surcharges globales pour certains composants MUI
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow:
                  mode === "light"
                    ? "0 4px 20px rgba(21, 101, 192, 0.3)"
                    : "0 4px 20px rgba(144, 202, 249, 0.3)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none", // pas de majuscule automatique
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 12px rgba(21, 101, 192, 0.4)",
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#ffffff" : "#2a2a2a",
                borderRadius: 8,
                "& .MuiInputLabel-root": {
                  color: mode === "light" ? "#1565c0" : "#90caf9",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: mode === "light" ? "#1565c0" : "#90caf9",
                  },
                  "&:hover fieldset": {
                    borderColor: mode === "light" ? "#0d47a1" : "#42a5f5",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: mode === "light" ? "#0d47a1" : "#42a5f5",
                    borderWidth: 2,
                  },
                },
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: mode === "light" ? "#bbdefb" : "#3949ab",
                },
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              root: {
                color: mode === "light" ? "#0d47a1" : "#e3f2fd",
              },
            },
          },
        },
      }),
    [mode]
  );

  // Fournit le thème + gestion du mode à tous les enfants
  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalise le CSS de base */}
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
