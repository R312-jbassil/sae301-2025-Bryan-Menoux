// ========================================
// Configuration et imports

import pb from "../../lib/pocketbase.js";
import { Collections } from "../../utils/pocketbase-types";

// ========================================
// Endpoint de test

export const GET = async () => {
  return new Response(
    JSON.stringify({ message: "Endpoint /api/login is alive" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

// ========================================
// Endpoint de connexion

export const POST = async ({ request, cookies }) => {
  const payload = await request.json();

  // ========================================
  // Gestion OAuth (Google)

  if (payload.token && payload.record) {
    try {
      pb.authStore.save(payload.token, payload.record);

      const cookieOptions = {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      };

      if (payload.remember) {
        cookieOptions.expires = new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        );
      }

      cookies.set("pb_auth", pb.authStore.exportToCookie(), cookieOptions);
      const user = pb.authStore.model;
      pb.authStore.clear();
      return new Response(JSON.stringify({ user }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("OAuth finalize error:", err);
      pb.authStore.clear();
      return new Response(JSON.stringify({ error: "OAuth finalize failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // ========================================
  // Connexion par email/mot de passe

  const { email, password, remember } = payload;

  console.log("Tentative de connexion avec email:", email);

  try {
    // ========================================
    // Authentification avec la collection "utilisateur"

    const authData = await pb
      .collection("utilisateur")
      .authWithPassword(email, password);

    console.log("✅ Authentification réussie pour:", email);

    // ========================================
    // Enregistrement du cookie

    // Si "Se souvenir de moi" est coché : cookie persiste 365 jours
    // Sinon : cookie de session (expires non défini = cookie de session)
    const cookieOptions = {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    };

    if (remember) {
      cookieOptions.expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }

    cookies.set("pb_auth", pb.authStore.exportToCookie(), cookieOptions);

    // ========================================
    // Retour des données utilisateur

    return new Response(
      JSON.stringify({
        user: {
          id: authData.record.id,
          email: authData.record.email,
          prenom: authData.record.prenom_utilisateur,
          nom: authData.record.nom_utilisateur,
          verified: authData.record.verified,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(
      "Erreur de connexion :",
      err.response?.data?.message || err.message
    );

    const errorMessage =
      err.response?.data?.message || "Email ou mot de passe incorrect";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: err.status || 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
