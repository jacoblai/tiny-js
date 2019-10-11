var express = require('express');
var router = express.Router();
const graphqlHTTP = require('express-graphql');
var {buildSchema} = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
    deleteMessage(id: ID!): String
  }
`);

// If Message had any complex fields, we'd put them on this object.
class Message {
    constructor(id, {content, author}) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

// Maps username to content
var fakeDatabase = {};

var root = {
    getMessage: function ({id}) {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        return new Message(id, fakeDatabase[id]);
    },
    createMessage: function ({input}) {
        // Create a random id for our "database".
        var id = require('crypto').randomBytes(10).toString('hex');

        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    updateMessage: function ({id, input}) {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        // This replaces all old data, but some apps might want partial update.
        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    deleteMessage: function ({id}) {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        delete fakeDatabase[id];
        return "ok";
    }
};

router.post('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

module.exports = router;
