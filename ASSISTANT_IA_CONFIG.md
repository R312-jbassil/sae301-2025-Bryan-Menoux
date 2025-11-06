# Configuration de l'Assistant IA

## 🔧 Variables d'environnement requises

Pour que l'Assistant IA fonctionne correctement, vous devez configurer les variables d'environnement suivantes :

### 1. Créer le fichier `.env`

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

### 2. Ajouter votre token Hugging Face

Obtenez un token depuis [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) :

```env
HF_TOKEN=votre_token_ici
HF_URL=https://api-inference.huggingface.co/v1
```

### ✅ Vérification

Pour vérifier que votre configuration est correcte, testez l'endpoint :

```bash
curl http://localhost:3000/apis/generateSVG
```

Vous devriez recevoir une réponse JSON confirmant les variables d'environnement.

### 🐛 Dépannage

#### Erreur 500 : "Variables d'environnement manquantes"

- Vérifiez que `.env` existe
- Vérifiez que `HF_TOKEN` n'est pas vide
- Vérifiez que `HF_URL` est correct

#### Erreur API Hugging Face

- Assurez-vous que votre token est valide
- Vérifiez les quotas d'utilisation sur [huggingface.co](https://huggingface.co)
- Le modèle `meta-llama/Llama-3.1-8B-Instruct:novita` doit être accessible

#### Astro n'accède pas aux variables

- Astro utilise `import.meta.env` côté client
- Les variables doivent être préfixées avec `PUBLIC_` pour être accessibles côté client
- Côté serveur (dans les endpoints), utilisez `import.meta.env` directement

## 📝 Comment fonctionne l'Assistant IA

1. L'utilisateur décrit ses lunettes (ex: "Monture titane noir mat, verres ronds 48mm")
2. L'input est envoyé à `/apis/generateSVG`
3. L'endpoint appelle l'API Hugging Face avec Llama 3.1
4. L'IA retourne une configuration JSON
5. Le composant applique cette configuration aux champs du formulaire
6. Les lunettes se mettent à jour en temps réel

## 🚀 Exemple de prompt

```
Monture titane, noir mat, verres ronds 48 mm, pont 20 mm, teinte bleue
```

L'IA va interpréter et retourner :

```json
{
  "materiau_monture": "titane",
  "materiau_branches": "titane",
  "couleur_monture": "#000000",
  "couleur_branches": "#000000",
  "finition": "mat",
  "largeur_verres": 48,
  "hauteur_verres": 48,
  "largeur_pont": 20,
  "verres_teintes": true,
  "teinte_hex": "#4169E1",
  "verres_polarises": false
}
```
