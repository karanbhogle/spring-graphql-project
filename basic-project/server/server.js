const express = require('express');
const { ApolloServer } = require('apollo-server-express');

//The author's data mimics JSON data that may come from any database. 
const authors = [
    {
        id: "1",
        info: {
            name: "Joe Kelly",
            age: 32,
            gender: "M"
        }
    },
    {
        id: "2",
        info: {
            name: "Mary Jane",
            age: 27,
            gender: "F"
        }
    }
];

//GraphQL schema in String Form
const typeDefs = `
    type Author {
        id: ID!
        info: Person
    }

    type Person {
        name: String!
        age: Int
        gender: String
    }

    type Query {
        getAuthors: [Author]
        retrieveAuthor(id: ID!) : Author
    }

    type DeleteMessage {
        id: ID!
        message: String
    }

    type Mutation {
        createAuthor(name: String!, gender: String!): Author,
        updateAuthor(id: ID!, name: String, age: Int, gender: String): Author
        deleteAuthor(id: ID!): DeleteMessage
    }
`;

// The resolvers
const resolvers = {
    Query: {
        getAuthors: () => authors,
        retrieveAuthor: (obj, {id}) => authors.find(author => author.id === id)
    },

    Mutation: {
        createAuthor: (obj, args) => {
            const id = String(authors.length + 1);
            const {name, gender} = args;

            const newAuthor = {
                id,
                info: {
                    name,
                    gender
                }
            }

            authors.push(newAuthor);
            return newAuthor;
        },
        updateAuthor: (obj, { id, name, age, gender }) => {
            const author = authors.find(author => author.id === id)

            if(author) {
                const authorIdx = authors.indexOf(author);
                if(name) author.name = name;
                if(age) author.age = age;
                if(gender) author.gender = gender;

                authors[authorIdx] = {id, info: author};

                return authors[authorIdx];
            } else {
                throw new Error(`Can't find Author with ID: ${id}`);
            }
        },
        deleteAuthor: (obj, {id}) => {
            const author = authors.find(author => author.id === id);
            if(author) {
                const authorIdx = authors.indexOf(author);
                authors.splice(authorIdx, 1);
                return {id, message: `Author with ID ${id} deleted successfully`};
            } else {
                throw new Error(`Can't find Author with ID: ${id} to delete`);
            }
        }
    }
};

const PORT = 3600;

//put together a schema
//const server = new ApolloServer({typeDefs, resolvers});

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