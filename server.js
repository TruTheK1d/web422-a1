const express = require("express");
const cors = require("cors");
require("dotenv").config();
const SitesDB = require("./modules/sitesDB");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const db = new SitesDB();

// Root test route
app.get("/", (req, res) => {
  res.json({
    message: "API Listening",
    term: "Summer 2025",
    student: "Turmunkh Davaajargal" 
  });
});

// POST /api/sites
app.post("/api/sites", async (req, res) => {
  try {
    const newSite = await db.addNewSite(req.body);
    res.status(201).json(newSite);
  } catch (err) {
    res.status(500).json({ message: "Failed to add site", error: err.message });
  }
});

// GET /api/sites
app.get("/api/sites", async (req, res) => {
  const { page, perPage, name, region, provinceOrTerritoryName } = req.query;
  try {
    const sites = await db.getAllSites(page, perPage, name, region, provinceOrTerritoryName);
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: "Failed to get sites", error: err.message });
  }
});

// GET /api/sites/:id
app.get("/api/sites/:id", async (req, res) => {
  try {
    const site = await db.getSiteById(req.params.id);
    if (!site) {
      res.status(404).json({ message: "Site not found" });
    } else {
      res.json(site);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to get site", error: err.message });
  }
});

// PUT /api/sites/:id
app.put("/api/sites/:id", async (req, res) => {
  try {
    const result = await db.updateSiteById(req.body, req.params.id);
    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Site not found" });
    } else {
      res.status(204).end(); 
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to update site", error: err.message });
  }
});

// DELETE /api/sites/:id
app.delete("/api/sites/:id", async (req, res) => {
  try {
    const result = await db.deleteSiteById(req.params.id);
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Site not found" });
    } else {
      res.status(204).end(); 
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to delete site", error: err.message });
  }
});

// Start server after DB is ready
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
  });
}).catch(err => {
  console.log("DB Failed:", err);
});


