// Variables globales
const imageURL = 'https://raw.githubusercontent.com/berru-g/challenge-codepen/main/img/facture-exemple.jpg'; //
const imageURL2 = '';
const pieces = []; // Tableau pour stocker les morceaux
const results = []; // Tableau pour stocker les résultats

// Fonction pour charger l'image et découper les morceaux
function generateCaptcha() {
  const captchaContainer = document.getElementById("captcha-container");
  fetch(imageURL)
    .then(response => response.blob())
    .then(blob => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(blob);
      img.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        for (let y = 0; y < img.height; y += 50) {
          for (let x = 0; x < img.width; x += 100) {
            const piece = ctx.getImageData(x, y, 100, 50);
            pieces.push(piece);
          }
        }
        displayCaptcha();
      };
    });
}

// Fonction pour afficher le CAPTCHA
function displayCaptcha() {
  const captchaContainer = document.getElementById("captcha-container");
  captchaContainer.innerHTML = "";
  pieces.forEach((piece, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = piece.width;
    canvas.height = piece.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(piece, 0, 0);
    const image = new Image();
    image.src = canvas.toDataURL();
    image.classList.add("captcha-piece");
    image.setAttribute("data-index", index);
    captchaContainer.appendChild(image);
  });
}

// Fonction pour enregistrer les résultats
function saveResult() {
  const documentType = document.getElementById("document-type").value;
  const selectedPieces = document.querySelectorAll(".captcha-piece.selected");
  const selectedIndices = Array.from(selectedPieces).map(piece => piece.getAttribute("data-index"));
  results.push({
    documentType,
    selectedIndices
  });
  displayResults();
}

// Fonction pour afficher les résultats
function displayResults() {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Efface les résultats précédents

  // Affiche les résultats sous forme de texte lisible
  results.forEach((result, index) => {
    const resultText = `Résultat ${index + 1}: Type - ${result.documentType}, scan envoyé à Doc/2023/ ${result.documentType} - ${result.selectedIndices}`;
    const resultElement = document.createElement("p");
    resultElement.textContent = resultText;
    resultsContainer.appendChild(resultElement);
  });
}


// Événement pour capturer les sélections du CAPTCHA
document.addEventListener("click", function(event) {
  const target = event.target;
  if (target.classList.contains("captcha-piece")) {
    target.classList.toggle("selected");
  }
});

// Appel pour générer le CAPTCHA lors du chargement de la page
generateCaptcha();

/*
// Variable globale pour stocker le ID de la feuille de calcul Google Sheets
const sheetId = "VOTRE_ID_FEUILLE_DE_CALCUL";

// Fonction pour enregistrer les résultats dans Google Sheets
function saveResultToGoogleSheets() {
  const documentType = document.getElementById("document-type").value;
  const selectedPieces = document.querySelectorAll(".captcha-piece.selected");
  const selectedIndices = Array.from(selectedPieces).map(piece => piece.getAttribute("data-index"));
  
  // Construire l'objet de données à envoyer à Google Sheets
  const data = {
    documentType,
    selectedIndices: selectedIndices.join(", ")
  };

  // Envoyer les données à Google Sheets en utilisant l'API Google Sheets
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A2", // La plage où les données seront ajoutées dans votre feuille de calcul
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    resource: {
      values: [[data.documentType, data.selectedIndices]]
    }
  }).then((response) => {
    console.log("Données enregistrées dans Google Sheets !");
  }, (error) => {
    console.error("Erreur lors de l'enregistrement des données : ", error.result.error.message);
  });
}

// Initialisez l'API Google Sheets
function initGoogleSheetsAPI() {
  gapi.client.init({
    apiKey: "VOTRE_CLE_API",
    clientId: "VOTRE_ID_CLIENT_OAUTH",
    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    scope: "https://www.googleapis.com/auth/spreadsheets"
  }).then(() => {
    console.log("API Google Sheets initialisée !");
  }).catch((error) => {
    console.error("Erreur lors de l'initialisation de l'API Google Sheets : ", error);
  });
}
*/