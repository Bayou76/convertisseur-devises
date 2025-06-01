/* eslint-disable no-unused-vars */
import axios from "axios";

// Clé API pour le service Fixer.io
const API_KEY = import.meta.env.VITE_FIXER_API_KEY;

/**
 * Récupère les taux de change depuis l'API Fixer.io
 * @param {string} base - Devise de base (par défaut "EUR")
 * @returns {Promise<object>} - Objet contenant les taux de change
 */
export const fetchRates = async (base = "EUR") => {
  try {
    const response = await axios.get(
  `https://data.fixer.io/api/latest?access_key=${API_KEY}&base=${base}`
);

    // Si la requête est réussie, retourner les taux
    if (response.data.success) {
      return response.data.rates;
    } else {
      // En cas d'erreur retournée par l'API
      throw new Error(response.data.error.info);
    }
  } catch (error) {
    // En cas d'erreur réseau ou autre
    throw new Error(error.message);
  }
};

/**
 * Récupère les informations des devises depuis RestCountries API
 * Associe chaque code devise à son nom complet et pays
 * @returns {Promise<object>} - Map des infos devises
 */
export const fetchCurrenciesInfo = async () => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    const map = {};

    // Parcours de chaque pays pour extraire les devises
    response.data.forEach((country) => {
      if (country.currencies) {
        Object.entries(country.currencies).forEach(([code, info]) => {
          // Ajouter uniquement si le code n'a pas encore été ajouté
          if (!map[code]) {
            map[code] = {
              name: info.name,
              country: country.name.common,
            };
          }
        });
      }
    });

    return map;
  } catch (error) {
    // En cas d'erreur d'appel API ou parsing
    throw new Error("Erreur lors du chargement des infos devises");
  }
};
