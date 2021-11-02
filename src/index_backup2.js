import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

async function startApolloServer(typeDefs, resolvers, context) {
    const server = new ApolloServer({ typeDefs, resolvers, context })
    const app = express();
    app.use(cors());
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    app.listen({ port: 8000 }, () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
    });
}

startApolloServer(
    schema,
    resolvers,
    {
        models,
        me: models.users[1],
    }
);