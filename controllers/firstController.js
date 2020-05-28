let {ObjectID} = require("mongodb");
let mongoUtil = require('../utils/mongoUtil');
let validator = require('../models/gqlValidator');

class FirstController {
    constructor() {
    }

    setRoot(root) {
        let client = mongoUtil.getClient();
        let mongo_msg = mongoUtil.getDb().collection("msg");
        root.getMessage = async function ({id}, req) {
            let role = req.header("role");
            console.log(role);

            let res = await mongo_msg.findOne({_id: ObjectID(id)});
            if (res === null){
                throw new Error("not found");
            }
            if (res.error) {
                throw new Error(res.error.errmsg);
            }
            res['id']= res["_id"];
            return res;
        };
        root.createMessage = async function ({input}) {
            const err = await validator.validate(input);
            if (err) {
                return  {"ok":false, "err":err.errmsg}
            }
            const session = client.startSession();
            session.startTransaction({});
            try {
                const opts = {session, returnOriginal: false};
                let res = await mongo_msg.insertOne(input, opts);
                if (res.error) {
                    return  {"ok":false, "err":res.error.errmsg}
                }
                await session.commitTransaction();
                session.endSession();
                return {"ok":true, data:res.insertedId.toString()};
            } catch (err) {
                await session.abortTransaction();
                session.endSession();
                return  {"ok":false, "err":err.errmsg}
            }
        };
        root.updateMessage = async function ({id, input}) {
            if (!ObjectID.isValid(id)) {
                return  {"ok":false, "err":'id is valid'}
            }
            const err = await validator.validate(input);
            if (err) {
                return  {"ok":false, "err":err.errmsg}
            }

            let res = await mongo_msg.findOneAndUpdate({_id: ObjectID(id)}, {"$set": input});
            if (res.error) {
                return  {"ok":false, "err":res.error.errmsg}
            }
            return {"ok":res.ok, "n":res.lastErrorObject.n}
        };
        root.deleteMessage = async function ({id}) {
            if (!ObjectID.isValid(id)) {
                return  {"ok":false, "err":'id is valid'}
            }
            let res = await mongo_msg.findOneAndDelete({_id: ObjectID(id)});
            if (res.error) {
                return {"ok":false, "err":res.error.errmsg}
            }
            return {"ok":res.ok, "n":res.lastErrorObject.n}
        }
    }
}

module.exports = FirstController;
