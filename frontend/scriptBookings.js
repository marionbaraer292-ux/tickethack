const bookingsContainer = document.getElementById("bookingsContainer");

const buildTimeBeforeDeparture = (ms) => {
    const duration = moment.duration(ms);

    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    let parts = "";
    if (days > 0) parts += `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) parts += ` ${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) parts += ` ${minutes} minute${minutes > 1 ? "s" : ""}`;

    return parts || "less than a minute";
};

const buildCartTrip = (item) => {
    const timeLeft =
        item.timeBeforeDeparture <= 0
            ? "Is out of time!"
            : `Departure in ${buildTimeBeforeDeparture(
                  item.timeBeforeDeparture
              )}`;
    return `
            <div class="cardTrip">
                <p>${item.trip.departure} > ${item.trip.arrival}</p>
                <p>${moment(item.trip.date).format("YYYY-MM-DD HH:mm")}</p>
                <p>${item.trip.price}€</p>
                <p>${timeLeft}</p>
            </div>
    `;
};

const getbookings = async () => {
    const response = await fetch(`${ENV.API_URL}/bookings`);
    const data = await response.json();
    const bookings = data.bookings;
    if (bookings?.length <= 0) {
        bookingsContainer.innerHTML = `
                <p>No booking yet.</p>
                <p>Why not plan a trip?</p></div>`;
        return;
    }
    const result = bookings
        .map((booking) => {
            return buildCartTrip(booking);
        })
        .join("");
        bookingsContainer.innerHTML = `<p>My bookings</p>
                            <div id="bookingList">${result}</div>
                            <div id="lineBlack"></div>
                            <p id="textEnjoy">Enjoy your travels with TicketHack!</p>`;
};

getbookings();
