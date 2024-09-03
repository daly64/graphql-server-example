import { makeExecutableSchema } from "@graphql-tools/schema";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import resolvers from "./resolvers.js";

// A number that we'll increment over time to simulate subscription events

const typeDefs = loadSchemaSync("api/graphql/typeDefs.graphql", {
  loaders: [new GraphQLFileLoader()],
});

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;
