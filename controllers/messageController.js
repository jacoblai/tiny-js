let {ObjectID} = require("mongodb");
let mongoUtil = require('../utils/mongoUtil');
let Result = require('../models/result');
let Message = require('../models/message');

class MessageController {
    constructor() {
    }

    setRoot(root) {
        let client = mongoUtil.getClient();
        let mongo = mongoUtil.getDb();
        root.getMessage = async function ({id}, req) {
            let role = req.header("role");
            // console.log(role);
            if (!ObjectID.isValid(id)) {
                throw new Error('id is valid');
            }
            let res = await mongo.collection("msg").countDocuments({_id: ObjectID(id)});
            if (res === 0) {
                throw new Error('no message exists with id ' + id);
            }

            res = await mongo.collection("msg").findOne({_id: ObjectID(id)});
            if (res.error) {
                throw new Error(res.error.errmsg);
            }
            return new Message(res._id.toString(), res.content, res.author);
        };
        root.createMessage = async function ({input}) {
            const err = await Message.validator(input);
            if (err) {
                throw new Error(err.errmsg);
            }
            const session = client.startSession();
            session.startTransaction({});
            try {
                const opts = {session, returnOriginal: false};
                let res = await mongo.collection("msg").insertOne(input, opts);
                if (res.error) {
                    throw new Error(res.error.errmsg);
                }
                await session.commitTransaction();
                session.endSession();
                return new Message(res.insertedId.toString());
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error;
            }
        };
        root.updateMessage = async function ({id, input}) {
            if (!ObjectID.isValid(id)) {
                throw new Error('id is valid');
            }
            const err = await Message.validator(input);
            if (err) {
                throw new Error(err.errmsg);
            }
            let res = await mongo.collection("msg").countDocuments({_id: ObjectID(id)});
            if (res === 0) {
                throw new Error('no message exists with id ' + id);
            }

            res = await mongo.collection("msg").findOneAndUpdate({_id: ObjectID(id)}, {"$set": input});
            if (res.error) {
                throw new Error(res.error.errmsg);
            }
            return new Result(res.ok, res.lastErrorObject.n, res.lastErrorObject.updatedExisting);
        };
        root.deleteMessage = async function ({id}) {
            if (!ObjectID.isValid(id)) {
                throw new Error('id is valid');
            }
            let res = await mongo.collection("msg").countDocuments({_id: ObjectID(id)});
            if (res === 0) {
                throw new Error('no message exists with id ' + id);
            }
            res = await mongo.collection("msg").findOneAndDelete({_id: ObjectID(id)});
            if (res.error) {
                throw new Error(res.error.errmsg);
            }
            return new Result(res.ok, res.lastErrorObject.n);
        }
    }
}

module.exports = MessageController;
