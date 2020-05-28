class gqlValidator {
    static async validate(input) {
        if (typeof input == "string") {
            if (!ObjectID.isValid(input.toString())) {
                throw new Error('id is valid not object id');
            }
        }
        for (let k in input) {
            let o = input[k];
            if (typeof o != "object" && typeof o != "function" || o === null) {
                continue;
            }
            if (typeof o == "string") {
                if (k.includes('id')) {
                    if (!ObjectID.isValid(o.toString())) {
                        throw new Error('id is valid not object id');
                    }
                    continue;
                }
                if (k.includes('mail')) {
                    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!reg.test(o.toString())) {
                        throw new Error(k + ' field invalid not mail');
                    }
                    continue;
                }
                if (o.toString().length > 1024) {
                    throw new Error(k + ' field invalid too large');
                }
            }
            if (typeof o == "number") {
                if (o < 0 || o > 99999999) {
                    throw new Error(k + ' field invalid');
                }
            }
        }
    }
}

module.exports = gqlValidator;
