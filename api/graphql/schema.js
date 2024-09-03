import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./resolvers.js";

const typeDefs= `#graphql 
type Message {
  id: ID!
  text: String!
}

type Mutation {
  createMessage(text: String!): Message
  updateMessage(id: ID!, text: String!): Message
  deleteMessage(id: ID!): Message
}
type Query {
  messages: [Message!]
  message(id: ID!): Message
}
type Subscription {
  messages: [Message!]
}
`




// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;
