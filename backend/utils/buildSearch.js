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
        const startOfDay = moment(date).startOf("day").toDate();
        const endOfDay = moment(date).endOf("day").toDate();
        search.date = { $gte: startOfDay, $lte: endOfDay };
    }

    return search;
};

module.exports = buildSearch;