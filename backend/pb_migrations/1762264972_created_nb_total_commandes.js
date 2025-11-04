/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number2299286586",
        "max": null,
        "min": null,
        "name": "total_commandes",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "json1559587887",
        "maxSize": 1,
        "name": "prix_total_gagne",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_2681347336",
    "indexes": [],
    "listRule": null,
    "name": "nb_total_commandes",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  'stats' AS id,\n  COUNT(*) AS total_commandes,\n  COALESCE(SUM(total), 0) AS prix_total_gagne\nFROM commande;",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2681347336");

  return app.delete(collection);
})
