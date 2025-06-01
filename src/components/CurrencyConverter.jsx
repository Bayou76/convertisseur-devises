import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { fetchRates, fetchCurrenciesInfo } from "../services/api";
import RateChart from "./RateChart";

export default function CurrencyConverter() {
  // États pour les données d'entrée utilisateur et les résultats
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState({});
  const [currenciesInfo, setCurrenciesInfo] = useState({});
  const [result, setResult] = useState(null);

  // États pour le chargement et les erreurs
  const [loadingRates, setLoadingRates] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [error, setError] = useState(null);

  // Chargement des infos pays/devises au démarrage
  useEffect(() => {
    setLoadingInfo(true);
    fetchCurrenciesInfo()
      .then((map) => {
        setCurrenciesInfo(map);
        setLoadingInfo(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoadingInfo(false);
      });
  }, []);

  // Chargement des taux à chaque fois que la devise de départ change
  useEffect(() => {
    if (!from) return;
    setLoadingRates(true);
    setError(null);
    fetchRates(from)
      .then((rates) => {
        setRates(rates);
        // Si la devise cible n'existe pas dans les taux, on en choisit une autre
        if (!rates[to]) {
          setTo(Object.keys(rates)[0]);
        }
        setLoadingRates(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoadingRates(false);
      });
  }, [from]);

  // Calcul du résultat à chaque changement d'entrée ou de taux
  useEffect(() => {
    if (!rates) {
      setResult(null);
      return;
    }

    // Cas de base (EUR par défaut)
    if (from === "EUR" && rates[to]) {
      setResult((amount * rates[to]).toFixed(4));
    } 
    // Conversion vers EUR
    else if (to === "EUR" && rates[from]) {
      setResult((amount / rates[from]).toFixed(4));
    } 
    // Conversion entre deux devises ≠ EUR, via EUR
    else if (rates[from] && rates[to]) {
      const val = (amount / rates[from]) * rates[to];
      setResult(val.toFixed(4));
    } else {
      setResult(null);
    }
  }, [amount, from, to, rates]);

  // Liste des devises disponibles (triée)
  const currencies = Object.keys(rates).sort();

  // Affichage en cours de chargement
  if (loadingInfo || loadingRates) {
    return (
      <Box mt={5} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Chargement en cours...</Typography>
      </Box>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <Box mt={5} maxWidth={400} mx="auto">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Affichage principal
  return (
    <Box maxWidth={400} mx="auto" mt={4} p={2} sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Convertisseur de devises
      </Typography>

      {/* Saisie du montant */}
      <TextField
        label="Montant"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        fullWidth
        margin="normal"
        inputProps={{ min: 0, inputMode: "numeric", pattern: "[0-9]*" }}
      />

      {/* Bouton pour inverser les devises */}
      <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
        <Button
          variant="outlined"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          🔄 Inverser les devises
        </Button>
      </Box>

      {/* Sélection de la devise de départ */}
      <TextField
        select
        label="De"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        fullWidth
        margin="normal"
      >
        {currencies.map((code) => (
          <MenuItem key={code} value={code}>
            <Box>
              <Typography>{code}</Typography>
              {currenciesInfo[code] && (
                <Typography variant="caption" color="textSecondary">
                  {currenciesInfo[code].name} — {currenciesInfo[code].country}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </TextField>

      {/* Sélection de la devise cible */}
      <TextField
        select
        label="À"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        fullWidth
        margin="normal"
        disabled={currencies.length === 0}
      >
        {currencies.map((code) => (
          <MenuItem key={code} value={code}>
            <Box>
              <Typography>{code}</Typography>
              {currenciesInfo[code] && (
                <Typography variant="caption" color="textSecondary">
                  {currenciesInfo[code].name} — {currenciesInfo[code].country}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </TextField>

      {/* Résultat de la conversion */}
      <Typography variant="h6" mt={3}>
        Résultat : {result !== null ? `${result} ${to}` : "—"}
      </Typography>

      {/* Graphique des taux */}
      <Box mt={4}>
        <RateChart rates={rates} base={from} target={to} />
      </Box>
    </Box>
  );
}
