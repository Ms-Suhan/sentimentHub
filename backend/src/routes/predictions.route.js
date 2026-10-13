
const express = require("express");
const router = express.Router();
const axios = require('axios');
const Analysis = require('../models/analysis.model')



router.post('/', async (req, res) => {
    // console.log(req)
    const {text} = req.body

    const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        {text: text.trim()},
        {timeout: 10000}
    )
    const {sentiment, confidence} = response.data

    const savedSentiment = await Analysis.create({
        text: text.trim(),
        sentiment,
        confidence
    })

    return res.status(201).json({
        success: true,
        message: "Prediction Saved Successfully",
        data: savedSentiment
    })

})

router.get("/", (req, res) => {
  res.json({ message: "Get predictions" });
});

router.get("/:id", (req, res) => {
  res.json({
    message: "Get prediction",
    id: req.params.id
  });
});

module.exports = router;