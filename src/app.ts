import { Server } from "./presentation/server";
import { envs } from "./config";
import { AppRoutes } from "./presentation/routes";
import { MongoDatabase } from "./data/mongodb";

(() => {
  main();
})();

async function main() {
  //TODO: await database
  await MongoDatabase.connect({dbName: envs.dbName, mongoUrl: envs.mongoUrl});

  //TODO: start server
  new Server({ port: envs.port, routes: AppRoutes.routes }).start();
}
