import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import schema from "./graphql/schema.js";
// 1. Create an HTTP server with Express
const PORT = 3000;
const app = express();

// 2. Create a WebSocket server with ws
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});


// 3. Use graphql-ws to handle WebSocket requests
const serverCleanup = useServer({ schema }, wsServer);

// 4. Configure Apollo Server
const server = new ApolloServer({
  schema,

  // 5. Add a plugin to drain the HTTP connection
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // 6. Add a plugin to drain the WebSocket server
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

app.get("/", (req, res) => {
  res.redirect("/graphql");
});

// 7. Start the Apollo server
(async () => {
  await server.start();

  // 8. Add HTTP middleware for Apollo
  app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));

  // 9. Start the HTTP server
  httpServer.listen(PORT, () => {
    console.log(`GraphQL server ready at http://localhost:${PORT}`);
    console.log(`WebSocket endpoint ready at ws://localhost:${PORT}/graphql`);
  });
})();
