import { books } from "./fakeData.js";

 const resolvers = {
  Query: {
    books: () => books,
  },
};

export default resolvers;
