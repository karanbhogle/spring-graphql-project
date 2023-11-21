const authors = require('./author');

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

module.exports = resolvers;