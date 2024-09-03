import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const app = express();
const httpServer = createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});
const serverCleanup = useServer(
  {
    schema,
    introspection: true,
    playground: true,
  },
  wsServer
);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});





// const server = new ApolloServer({ typeDefs, resolvers });




const port = 3000;
app.use(cors());

app.get("/", (req, res) => {
  res.send("<a href='/graphql'>Go to GraphQL</a>");
});

await server.start();

app.use("/graphql", cors(), express.json(), expressMiddleware(server));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
