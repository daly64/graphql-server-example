import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const messages = [
  { id: "1", text: "message1" },
  { id: "2", text: "message2" },
];
export const resolvers = {
  Query: {
    messages: () => messages,

    message: (id) => {
      return messages.find((message) => message.id === id);
    },
  },

  Mutation: {
    createMessage: (text) => {
      const newMessage = {
        id: String(messages.length + 1),
        text,
      };
      messages.push(newMessage);
      pubsub.publish("NEW_MESSAGE", { messages });
      return newMessage;
    },

    updateMessage: (id, text) => {
      const message = messages.find((message) => message.id === id);
      if (!message) {
        throw new Error("Message not found");
      }
      message.text = text;
      pubsub.publish("NEW_MESSAGE", { messages });
      return message;
    },

    deleteMessage: (id) => {
      const index = messages.findIndex((message) => message.id === id);
      if (index === -1) {
        throw new Error("Message not found");
      }
      const deletedMessage = messages.splice(index, 1)[0];
      pubsub.publish("NEW_MESSAGE", { messages });
      return deletedMessage;
    },
  },

  Subscription: {
    messages: {
      subscribe: () => {
        setTimeout(() => pubsub.publish("NEW_MESSAGE", { messages }), 1000);
        return pubsub.asyncIterator(["NEW_MESSAGE"]);
      },
    },
  },
};

export default resolvers;