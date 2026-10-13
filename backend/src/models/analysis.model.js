const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema({
    // userId: {
    //     type: String,
    //     required: true,
    //     index: true
    // },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    language: {
        type: String,
        default: "en",

    },
    sentiment : {
        type: String,
        required: true,
        enum: ["positive", "negative", "netural"]
    },
    confidence: {
        type: Number,
        required: true
    }

    

}, {timestamps: true})


analysisSchema.index({userId: 1, createdAt: -1});

analysisSchema.index({sentiment: 1, createdAt: -1})

const Analysis = mongoose.model("Analysis", analysisSchema)

module.exports = Analysis