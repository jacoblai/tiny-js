let Joi = require('joi');

class Message {
    constructor(id, content, author) {
        this.id = id;
        this.content = content;
        this.author = author;
    }

    static async validator(input) {
        let validator = Joi.object().keys({
            content: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            author: Joi.string().email({minDomainAtoms: 2})
        });
        const vali = await Joi.validate(input, validator);
        if (vali.error) {
            return vali.error;
        }
    }
}

module.exports = Message;
