import 'dotenv/config';

const userCredentials = { firstname: 'Aman' };
const userDetails = { nationality: 'Indian' };
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';

const user = {
  ...userCredentials,
  ...userDetails,
};

console.log(user);

console.log(process.env.SOME_ENV_VARIABLE);

const schema = gql`
  type Query {
    users: [User!],
    user(id: ID!): User
    me: User
    hello: String!

    messages: [Message!]!
    message(id: ID!): Message!
  }
 
  type User {
    id: ID!
    username: String!
    fullname: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }
`;

let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
    firstname: 'Robin',
    lastname: 'Wieruch',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    firstname: 'Dave',
    lastname: 'Davids',
    messageIds: [2],
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};
 
const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },
    hello: () => {
      return "world"
    },

    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },
  },
  User: {
    fullname: user => `${user.lastname} ${user.firstname}`,
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
  },
  Message: {
    user: message => {
      return users[message.userId];
    },
  },
  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);
 
      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;
 
      if (!message) {
        return false;
      }
 
      messages = otherMessages;
 
      return true;
    },
  },
};
 
async function startApolloServer(typeDefs, resolvers, context){
  const server = new ApolloServer({typeDefs, resolvers, context})
  const app = express();
  app.use(cors());
  await server.start();
  server.applyMiddleware({app, path: '/graphql'});
  
  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
}

startApolloServer(
  schema, 
  resolvers,
  {
    me: users[1],
  }
);