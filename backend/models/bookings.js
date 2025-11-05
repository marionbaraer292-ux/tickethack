const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "trips" },
    date: { type: Date, required: true },
    user: { type: String, default: "defaultUser" },
});

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
