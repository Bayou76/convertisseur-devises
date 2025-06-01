import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

// Composant d'affichage du graphique de taux de change
export default function RateChart({ rates, base }) {
  // Transformation des données : formatage pour le graphique
  const data = Object.entries(rates).map(([code, rate]) => ({
    name: code,       // Nom de la devise
    taux: parseFloat(rate),  // Valeur du taux (converti en nombre)
  }));

  return (
    <Box mt={4}>
      {/* Titre du graphique */}
      <Typography variant="h6" gutterBottom textAlign="center">
        Taux de change de {base} vers d'autres devises
      </Typography>

      {/* Conteneur responsive pour le graphique */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* Axe horizontal : codes des devises */}
          <XAxis dataKey="name" />
          
          {/* Axe vertical : taux */}
          <YAxis />

          {/* Info-bulle personnalisée au survol */}
          <Tooltip 
            formatter={(value) => [`${value}`, "Taux"]}
            labelFormatter={(label) => `Devise : ${label}`}
          />

          {/* Ligne représentant les taux */}
          <Line
            type="monotone"
            dataKey="taux"
            stroke="#1976d2"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}