import PocketBase from "pocketbase";

var path = "";
if (import.meta.env.MODE === "development")
  path = "http://localhost:8090"; //localhost = machine de dev
else path = "https://ta-vue.bryan-menoux.fr"; //machine de déploiement
const pb = new PocketBase(path);
export default pb;

// Exporter aussi l'URL pour utilisation dans les composants
export const POCKETBASE_URL = path;
