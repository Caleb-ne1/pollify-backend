const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
    question: {
        type: String,
        require: true
    },
    options: {
        type: Array
    },
    votes: Number,
    expireDate: {
        type: Date
    },
    expireTime: {
        type: String
    },
    isActive: {
        type: Boolean
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    tags: {
        type: Array
    },
    resultsVisibility: {
        type: Boolean
    },
    allowMultiple: {
        type: Boolean
    },
    userHasVoted: {
        type: Boolean
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}, {timestamps: true});

const Poll = mongoose.model("Poll", pollSchema)
module.exports = Poll;
