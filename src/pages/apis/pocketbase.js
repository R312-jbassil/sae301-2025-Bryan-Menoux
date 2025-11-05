import pb from "../../lib/pocketbase.js";

// Endpoint POST pour créer un modèle de lunettes
export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { collection, data } = body;

    if (!collection || !data) {
      return new Response(JSON.stringify({ error: "Données incomplètes" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Créer le record dans PocketBase
    const record = await pb.collection(collection).create({
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
    });

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
};
