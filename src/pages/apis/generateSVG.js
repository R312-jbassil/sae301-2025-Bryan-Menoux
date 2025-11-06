// ========================================
// Configuration et imports

import { OpenAI } from "openai";
import * as fs from "fs";
import * as path from "path";

// ========================================
// Charger les variables du .env manuellement

function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const lines = envContent.split("\n");

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const [key, ...valueParts] = trimmed.split("=");
          const value = valueParts.join("=").trim();
          if (key && value && !process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  } catch (e) {
    console.error(
      "[generateSVG] Erreur lors du chargement du .env:",
      e.message
    );
  }
}

loadEnv();

// ========================================
// Configuration environnement

const ACCESS_TOKEN = process.env.HF_TOKEN;
const BASE_URL = process.env.HF_URL;

console.log("[generateSVG] Environment check:");
console.log("[generateSVG] ACCESS_TOKEN exists:", !!ACCESS_TOKEN);
console.log("[generateSVG] BASE_URL:", BASE_URL);

// ========================================
// Endpoint de génération SVG

export const POST = async ({ request }) => {
  console.log("[generateSVG] Requête reçue");

  try {
    // Vérifier que les variables d'environnement sont définies
    if (!ACCESS_TOKEN || !BASE_URL) {
      console.error("[generateSVG] Variables d'environnement manquantes");
      console.error("[generateSVG] ACCESS_TOKEN:", ACCESS_TOKEN);
      console.error("[generateSVG] BASE_URL:", BASE_URL);
      return new Response(
        JSON.stringify({
          error:
            "Configuration insuffisante: variables d'environnement manquantes",
          details:
            "HF_TOKEN ou HF_URL non configurés. Configurez les variables d'environnement.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ========================================
    // Extraction et préparation des données

    const messages = await request.json();
    console.log("[generateSVG] Messages reçus :", messages);

    const client = new OpenAI({
      baseURL: BASE_URL,
      apiKey: ACCESS_TOKEN,
    });

    const SystemMessage = {
      role: "system",
      content: `You are a JSON-only assistant that helps users customize eyeglasses. You are VERY IMPORTANT to preserve existing values.
CRITICAL RULES:
1. You MUST respond with ONLY a valid JSON object, nothing else. No explanations, no markdown, no extra text.
2. If a user doesn't mention a parameter, KEEP the existing value from the current configuration (even if it's null).
3. If a parameter is null/empty in current config AND user doesn't mention it, use a reasonable default.
4. When updating, ONLY change what the user explicitly mentions.

INTERPRETATION GUIDE - Common user phrases mean:
- "Verres ronds 48mm" = largeur_verres: 48 (frame width in mm)
- "Verres carrés 50mm" = largeur_verres: 50
- "Verres 48x38" = largeur_verres: 48, hauteur_verres: 38
- "Pont 20mm" = largeur_pont: 20
- "Pont large" = largeur_pont: 22-24
- "Pont étroit" = largeur_pont: 15-17
- "Noir mat" = couleur: #000000, finition: mat
- "Bleu brillant" = couleur: #0000FF, finition: brillant
- "Acétate" = materiau: acetate
- "Titane" = materiau: titane
- "Inox" = materiau: inox

The JSON object must contain exactly these fields:
{
  "materiau_monture": "string (acetate|titane|inox)",
  "materiau_branches": "string (acetate|titane|inox)",
  "couleur_monture": "hex color like #000000 or null",
  "couleur_branches": "hex color like #000000 or null",
  "finition": "string (mat|brillant) or null",
  "largeur_verres": number (40-60) or null,
  "hauteur_verres": number (35-50) or null,
  "largeur_pont": number (15-25) or null,
  "verres_teintes": boolean,
  "teinte_hex": "hex color or null",
  "verres_polarises": boolean
}

Example:
Current config: {"couleur_monture": "#FF0000", "couleur_branches": "#0000FF", "materiau_monture": "acetate"}
User says: "verres ronds 52mm avec pont étroit"
You should: Set largeur_verres to 52, largeur_pont to 16-17, but KEEP couleur_monture as "#FF0000", couleur_branches as "#0000FF", and materiau_monture as "acetate"`,
    };

    // ========================================
    // Appel à l'API

    console.log("[generateSVG] Appel API avec model et messages...");
    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct:novita",
      messages: [SystemMessage, ...messages],
      max_tokens: 500,
    });

    // ========================================
    // Validation de la réponse

    if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
      throw new Error("Aucune réponse reçue de l'API");
    }

    const message = chatCompletion.choices[0].message;

    if (!message || !message.content) {
      throw new Error("Message vide reçu de l'API");
    }

    console.log("[generateSVG] Réponse brute de l'API :", message);

    // ========================================
    // Réponse succès

    return new Response(JSON.stringify({ svg: message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // ========================================
    // Gestion des erreurs

    console.error("[generateSVG] Erreur complète :", error);
    console.error("[generateSVG] Stack trace:", error.stack);

    return new Response(
      JSON.stringify({
        error: "Erreur lors de la génération de la configuration",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// ========================================
// Endpoint de test

export const GET = async () => {
  return new Response(
    JSON.stringify({
      message: "Endpoint /apis/generateSVG is alive",
      env: {
        hasToken: !!ACCESS_TOKEN,
        hasUrl: !!BASE_URL,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
