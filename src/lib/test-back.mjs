import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

async function main() {
  try {
    await pb.admins.authWithPassword("admin@admin.com", "testMdp25_");
    console.log("Connexion réussie ✅");

    const usersData = [
      {
        email: "alice@example.com",
        password: "azerty123",
        passwordConfirm: "azerty123",
        prenom_utilisateur: "Alice",
        nom_utilisateur: "Durand",
        verified: true,
      },
      {
        email: "bob@example.com",
        password: "azerty123",
        passwordConfirm: "azerty123",
        prenom_utilisateur: "Bob",
        nom_utilisateur: "Martin",
        verified: true,
      },
    ];

    const utilisateurs = [];
    for (const u of usersData) {
      const user = await pb.collection("utilisateur").create(u);
      utilisateurs.push(user);
      console.log(`Utilisateur créé : ${user.email}`);
    }

    const materiauxData = [
      { libelle_materiau: "Acier" },
      { libelle_materiau: "Titane" },
      { libelle_materiau: "Bois" },
    ];

    const materiaux = [];
    for (const m of materiauxData) {
      const mat = await pb.collection("materiau").create(m);
      materiaux.push(mat);
      console.log(`Matériau créé : ${mat.libelle_materiau}`);
    }

    const modelesData = [
      {
        titre: "Lunettes Classiques",
        code_svg: "<svg>...</svg>",
        couleur_monture: "noir",
        couleur_branches: "argent",
        finition: "mate",
        largeur_verres: 50,
        hauteur_verres: 40,
        largeur_pont: 18,
        verres_teintes: true,
        verres_polaries: false,
        teinte_hex: "#222222",
        prix: 120.5,
        id_materiau_branche: materiaux[0].id,
        id_materiau_montures: materiaux[1].id,
        id_utilisateur: utilisateurs[0].id,
      },
      {
        titre: "Lunettes Bois Naturel",
        code_svg: "<svg>...</svg>",
        couleur_monture: "marron",
        couleur_branches: "beige",
        finition: "brillante",
        largeur_verres: 48,
        hauteur_verres: 39,
        largeur_pont: 17,
        verres_teintes: false,
        verres_polaries: true,
        teinte_hex: "#886633",
        prix: 180.0,
        id_materiau_branche: materiaux[2].id,
        id_materiau_montures: materiaux[2].id,
        id_utilisateur: utilisateurs[1].id,
      },
    ];

    const modeles = [];
    for (const m of modelesData) {
      const mod = await pb.collection("modele").create(m);
      modeles.push(mod);
      console.log(`Modèle créé : ${mod.titre}`);
    }

    const commandesData = [
      { statut: "payee", total: 120.5, id_utilisateur: utilisateurs[0].id },
      { statut: "en_attente", total: 89.9, id_utilisateur: utilisateurs[1].id },
      { statut: "payee", total: 45.0, id_utilisateur: utilisateurs[0].id },
    ];

    const commandes = [];
    for (const c of commandesData) {
      const cmd = await pb.collection("commande").create(c);
      commandes.push(cmd);
      console.log(`Commande créée : ${cmd.id} (${c.total}€)`);
    }

    const lignesData = [
      {
        quantite: 1,
        prix_unitaire: 120.5,
        code_svg: "<svg>...</svg>",
        id_modele: modeles[0].id,
        id_commande: commandes[0].id,
      },
      {
        quantite: 2,
        prix_unitaire: 45.0,
        code_svg: "<svg>...</svg>",
        id_modele: modeles[1].id,
        id_commande: commandes[1].id,
      },
      {
        quantite: 1,
        prix_unitaire: 180.0,
        code_svg: "<svg>...</svg>",
        id_modele: modeles[1].id,
        id_commande: commandes[2].id,
      },
    ];

    for (const l of lignesData) {
      const ligne = await pb.collection("ligne_commande").create(l);
      console.log(`Ligne de commande créée : ${ligne.id}`);
    }

    const sauvegardesData = [
      {
        nom: "Config Alice",
        code_svg: "<svg>...</svg>",
        historique_chat: "Première configuration test.",
        id_utilisateur: utilisateurs[0].id,
      },
      {
        nom: "Config Bob",
        code_svg: "<svg>...</svg>",
        historique_chat: "Configuration alternative.",
        id_utilisateur: utilisateurs[1].id,
      },
    ];

    for (const s of sauvegardesData) {
      const sauvegarde = await pb.collection("sauvegarde").create(s);
      console.log(`Sauvegarde créée : ${sauvegarde.nom}`);
    }

    console.log("---");
    console.log("Récupération des statistiques (vue nb_total_commandes)...");
    const stats = await pb.collection("nb_total_commandes").getFullList();
    console.log(stats[0]);
    console.log("✅ Données de test créées avec succès");
  } catch (err) {
    console.error("Erreur :", err);
  }
}

main();
