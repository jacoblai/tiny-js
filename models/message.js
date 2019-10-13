let Joi = require('joi');

class Message {
    constructor(id, content, author) {
        this.id = id;
        this.content = content;
        this.author = author;
    }

    static validator() {
        return Joi.object().keys({
            content: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            author: Joi.string().email({minDomainAtoms: 2})
        });
    }
}

module.exports = Message;
