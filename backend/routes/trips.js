const express = require("express");
const router = express.Router();
const Trip = require("../models/trips");
const buildSearch = require("../utils/buildSearch");

router.get("/", async (req, res) => {
    try {
        const today = new Date();
        const trips = await Trip.find({
            available: { $ne: false },
            date: { $gte: today },
        });
        return res.json({ result: true, trips });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ result: false, error: "Database error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const searchParams = buildSearch(req.body);

        const trips = await Trip.find({
            ...searchParams,
            available: { $ne: false },
        });

        if (trips.length <= 0)
            return res.json({ result: false, message: "No trips found" });

        return res.json({ result: true, trips });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ result: false, error: "Database error" });
    }
});

module.exports = router;
