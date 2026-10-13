const mongoose = require('mongoose')

const textSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Text = mongoose.mode("Text", textSchema)

module.expots = Text
