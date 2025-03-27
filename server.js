const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(
    cors({
      origin: "http://localhost:8081", // Allow requests only from this origin
      methods: "GET,POST",
      allowedHeaders: "Content-Type",
    })
  );
  app.use(express.json()); // Allows JSON body parsing

app.post("/fetch-job", async (req, res) => {
    const { url } = req.body;
    if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }); 
    res.json({ html: response.data }); // Send raw HTML to frontend
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job listing" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
