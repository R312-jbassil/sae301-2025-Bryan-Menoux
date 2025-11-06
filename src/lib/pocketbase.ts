import PocketBase from "pocketbase";

var path = "";
if (import.meta.env.MODE === "development")
  path = "http://localhost:8090"; //localhost = machine de dev
else path = "http://localhost:8090"; //localhost = machine de déploiement
const pb = new PocketBase(path);
export default pb;
