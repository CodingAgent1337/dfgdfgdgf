const mongoose = require("mongoose");

const altdetectorSchema = mongoose.Schema({
    id: { type: String, required: true },
    age: { type: Number, required: true },
    log: { type: String, required: true },
    guild: { type: String, required: true },
  })

module.exports = mongoose.model('altDetector', altdetectorSchema);