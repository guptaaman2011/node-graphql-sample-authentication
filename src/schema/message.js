import { gql } from 'apollo-server-express';

  // messages: [Message!]!

export default gql`
  extend type Query {
    messages(offset: Int, limit: Int): [Message!]!
    message(id: ID!): Message!
  }
  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }
  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }
`;