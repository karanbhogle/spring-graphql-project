const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./schema');
const resolvers = require('./resolver');

const PORT = 3600;
const app = express();

let apolloServer = null;
async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        path: '/graphql'
    });

    app.listen(PORT, () => {
        console.log(`server running at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
}

startServer();