// API endpoint pour créer/mettre à jour les modèles de lunettes
export async function POST({ request }) {
  try {
    // Vérifier que la méthode est POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Récupérer le body JSON
    const body = await request.json();
    const { collection, data } = body;

    // Vérifier que les données sont complètes
    if (!collection || !data) {
      return new Response(JSON.stringify({ error: "Données incomplètes" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Préparer les données pour PocketBase
    const formData = new FormData();
    formData.append("titre", data.titre);
    formData.append("code_svg", data.code_svg);
    formData.append("couleur_monture", data.couleur_monture || "#4169E1");
    formData.append("couleur_branches", data.couleur_branches || "black");
    formData.append("finition", data.finition || "");
    formData.append("largeur_verres", parseInt(data.largeur_verres) || 0);
    formData.append("hauteur_verres", parseInt(data.hauteur_verres) || 0);
    formData.append("largeur_pont", parseInt(data.largeur_pont) || 0);
    formData.append("verres_teintes", data.verres_teintes ? true : false);
    formData.append("teinte_hex", data.teinte_hex || "");
    formData.append("verres_polarises", data.verres_polarises ? true : false);
    formData.append("prix", parseFloat(data.prix) || 0);

    // Appeler l'API REST de PocketBase
    const pocketbaseUrl = "http://127.0.0.1:8090/api/collections";
    const response = await fetch(`${pocketbaseUrl}/${collection}/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titre: data.titre,
        code_svg: data.code_svg,
        couleur_monture: data.couleur_monture || "#4169E1",
        couleur_branches: data.couleur_branches || "black",
        finition: data.finition || "",
        largeur_verres: parseInt(data.largeur_verres) || 0,
        hauteur_verres: parseInt(data.hauteur_verres) || 0,
        largeur_pont: parseInt(data.largeur_pont) || 0,
        verres_teintes: data.verres_teintes ? true : false,
        teinte_hex: data.teinte_hex || "",
        verres_polarises: data.verres_polarises ? true : false,
        prix: parseFloat(data.prix) || 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur PocketBase:", errorData);
      throw new Error(`Erreur PocketBase: ${response.status}`);
    }

    const record = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        id: record.id,
        message: "Modèle créé avec succès",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erreur lors de la création du modèle:", error);

    return new Response(
      JSON.stringify({
        error: "Erreur lors de la création du modèle",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
