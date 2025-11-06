const express = require("express");
const router = express.Router();
const Trip = require("../models/trips");
const Cart = require("../models/carts");
const Booking = require("../models/bookings");

router.get("/", async (req, res) => {
    const user = "defaultUser";
    try {
        const cartItems = await Cart.find({ user }).populate("tripId");
        return res.json({ result: true, cartItems });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ result: false, error: "Database error" });
    }
});

router.post("/add", async (req, res) => {
    const { tripId } = req.body;
    const user = "defaultUser";
    try {
        const trip = await Trip.findById(tripId);
        if (!trip || trip.available === false)
            return res
                .status(400)
                .json({ result: false, message: "Trip not available" });

        const cartItem = new Cart({ tripId, user, date: trip.date });
        await cartItem.save();

        trip.available = false;
        await trip.save();

        res.json({ result: true, cartItem });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ result: false, error: "Database error" });
    }
});

router.delete("/:cartId", async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.cartId).populate(
            "tripId"
        );
        if (!cartItem)
            return res
                .status(404)
                .json({ result: false, message: "Cart item not found" });

        const trip = await Trip.findById(cartItem.tripId._id);
        if (trip) {
            trip.available = true;
            await trip.save();
        }

        await cartItem.deleteOne({ _id: req.params.cartId });
        res.json({ result: true, message: "Cart item removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, error: "Database error" });
    }
});

router.post("/pay", async (req, res) => {
    const user = "defaultUser";
    try {
        const cartItems = await Cart.find({ user });
        if (cartItems.length === 0)
            return res
                .status(400)
                .json({ result: false, message: "Cart is empty" });

        const bookings = [];
        for (const item of cartItems) {
            const booking = new Booking({
                tripId: item.tripId,
                date: item.date,
                user,
            });
            await booking.save();
            bookings.push(booking);
        }

        await Cart.deleteMany({ user });
        res.json({ result: true, bookings });
    } catch (err) {
        console.log(err);
        res.status(500).json({ result: false, error: "Database error" });
    }
});

module.exports = router;
