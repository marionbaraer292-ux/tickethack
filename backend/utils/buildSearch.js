const moment = require("moment");

const buildSearch = (params = {}) => {
    const { departure, arrival, date } = params;
    const search = {};

    if (departure) {
        search.departure = { $regex: new RegExp(departure, "i") };
    }

    if (arrival) {
        search.arrival = { $regex: new RegExp(arrival, "i") };
    }

    if (date) {
        const startOfDay = moment.utc(date).startOf("day").toDate();
        const endOfDay = moment.utc(date).endOf("day").toDate();
        search.date = { $gte: startOfDay, $lte: endOfDay };
    } else {
        search.date = { $gte: new Date() };
    }

    return search;
};

module.exports = buildSearch;
