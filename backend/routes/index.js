const express = require("express");
const router = express.Router();
const tripsRouter = require("./trips");
const cartsRouter = require("./carts");
const bookingsRouter = require("./bookings");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});

router.use("/trips", tripsRouter);
router.use("/carts", cartsRouter);
router.use("/bookings", bookingsRouter);

module.exports = router;
