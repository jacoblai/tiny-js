let Message = require('../models/message');

class MessageController {
    constructor() {
        this.fakeDatabase = {};
    }

    getSchema() {
        return `
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
        `;
    }

    setRoot(root) {
        let that = this;
        let msg = {
            getMessage: function ({id}, req) {
                let role = req.header("role");
                console.log(role);
                if (!that.fakeDatabase[id]) {
                    throw new Error('no message exists with id ' + id);
                }
                return new Message(id, that.fakeDatabase[id].content, that.fakeDatabase[id].author);
            },
            createMessage: function ({input}) {
                // Create a random id for our "database".
                let id = require('crypto').randomBytes(10).toString('hex');

                that.fakeDatabase[id] = input;
                return new Message(id, input);
            },
            updateMessage: function ({id, input}) {
                if (!that.fakeDatabase[id]) {
                    throw new Error('no message exists with id ' + id);
                }
                // This replaces all old data, but some apps might want partial update.
                that.fakeDatabase[id] = input;
                return new Message(id, input);
            },
            deleteMessage: function ({id}) {
                if (!that.fakeDatabase[id]) {
                    throw new Error('no message exists with id ' + id);
                }
                delete that.fakeDatabase[id];
                return "ok";
            }
        };
        Object.assign(root, root, msg);
    }
}

module.exports = MessageController;
