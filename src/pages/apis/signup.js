import pb from "../../lib/pocketbase.js";

export const GET = async () => {
  return new Response(
    JSON.stringify({ message: "Endpoint /api/signup is alive" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const POST = async ({ request, cookies }) => {
  const payload = await request.json();

  const {
    prenom_utilisateur,
    nom_utilisateur,
    email,
    password,
    passwordConfirm,
    remember,
  } = payload;

  if (!prenom_utilisateur || !nom_utilisateur || !email || !password) {
    return new Response(
      JSON.stringify({ error: "Tous les champs sont requis" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Créer un nouvel utilisateur
    const newUser = await pb.collection("utilisateur").create({
      email,
      password,
      passwordConfirm,
      prenom_utilisateur,
      nom_utilisateur,
      emailVisibility: false,
      verified: false,
    });

    console.log("✅ Utilisateur créé avec succès:", email);

    // Si "Se souvenir de moi" est coché, authentifier l'utilisateur
    let cookieOptions = {};
    if (remember) {
      try {
        const authData = await pb
          .collection("utilisateur")
          .authWithPassword(email, password);

        cookieOptions = {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        };

        cookies.set("pb_auth", pb.authStore.exportToCookie(), cookieOptions);
        pb.authStore.clear();
      } catch (authErr) {
        console.log("Note: Authentification après inscription non effectuée");
      }
    }

    return new Response(
      JSON.stringify({
        user: {
          id: newUser.id,
          email: newUser.email,
          prenom: newUser.prenom_utilisateur,
          nom: newUser.nom_utilisateur,
          verified: newUser.verified,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(
      "Erreur lors de la création d'utilisateur:",
      err.response?.data?.message || err.message
    );

    const errorMessage =
      err.response?.data?.message || "Erreur lors de l'inscription";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: err.status || 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
