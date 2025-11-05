const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "trips" },
    date: { type: Date, required: true },
    user: { type: String, default: "defaultUser" },
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = Cart;
