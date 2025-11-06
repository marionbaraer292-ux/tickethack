const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings");
const moment = require("moment");

router.get("/", async (req, res) => {
    const user = "defaultUser";
    try {
        const bookings = await Booking.find({ user }).populate("tripId");
        const result = bookings.map((b) => {
            const now = moment();
            const departure = moment(b.tripId.date);
            const timeBeforeDeparture = departure.diff(now);
            return {
                _id: b._id,
                trip: b.tripId,
                date: b.date,
                timeBeforeDeparture,
            };
        });

        res.json({ result: true, bookings: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ result: false, error: "Database error" });
    }
});

router.get("/:bookingId", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId).populate(
            "tripId"
        );
        if (!booking) {
            return res
                .status(404)
                .json({ result: false, message: "Booking not found" });
        }
        res.json({ result: true, booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, error: "Database error" });
    }
});

module.exports = router;
