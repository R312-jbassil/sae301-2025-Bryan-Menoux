/**
 * Generated types from PocketBase Schema
 * This file is auto-generated - do not edit manually
 */

export enum Collections {
  Utilisateur = "utilisateur",
  Sauvegarde = "sauvegarde",
  Materiau = "materiau",
  Modele = "modele",
  Commande = "commande",
  LigneCommande = "ligne_commande",
  NbTotalCommandes = "nb_total_commandes",
}

// ========================================
// Utilisateur
// ========================================

export interface UtilisateurRecord {
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  prenom_utilisateur: string;
  nom_utilisateur: string;
  created: string;
  updated: string;
}

// ========================================
// Sauvegarde
// ========================================

export interface SauvegardeRecord {
  id: string;
  utilisateur: string; // relation to utilisateur
  nom_sauvegarde: string;
  donnees_sauvegarde: string; // JSON data
  created: string;
  updated: string;
}

// ========================================
// Materiau
// ========================================

export interface MateriauRecord {
  id: string;
  nom_materiau: string;
  prix_materiau: number;
  created: string;
  updated: string;
}

// ========================================
// Modele
// ========================================

export interface ModeleRecord {
  id: string;
  nom_modele: string;
  image_modele: string;
  prix_modele: number;
  materiau: string; // relation to materiau
  created: string;
  updated: string;
}

// ========================================
// Commande
// ========================================

export interface CommandeRecord {
  id: string;
  utilisateur: string; // relation to utilisateur
  statut_commande: string;
  date_commande: string;
  prix_total: number;
  created: string;
  updated: string;
}

// ========================================
// LigneCommande
// ========================================

export interface LigneCommandeRecord {
  id: string;
  commande: string; // relation to commande
  modele: string; // relation to modele
  quantite: number;
  prix_unitaire: number;
  created: string;
  updated: string;
}

// ========================================
// NbTotalCommandes
// ========================================

export interface NbTotalCommandesRecord {
  id: string;
  nombre: number;
  created: string;
  updated: string;
}

// ========================================
// Auth Response Types
// ========================================

export interface AuthResponse {
  token: string;
  record: UtilisateurRecord;
}

export interface ListResult<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}
