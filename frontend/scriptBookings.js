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
            ? `<p style="color:red;">Departure since ${buildTimeBeforeDeparture(
                  -item.timeBeforeDeparture
              )}</p>`
            : `<p style="color:green;">Departure in ${buildTimeBeforeDeparture(
                  item.timeBeforeDeparture
              )}</p>`;
    return `
            <div class="cardTrip">
                <p>${item.trip.departure} > ${item.trip.arrival}</p>
                <p>${moment(item.trip.date).format("YYYY-MM-DD HH:mm")}</p>
                <p>${item.trip.price}€</p>
                ${timeLeft}
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
    const result = bookings.sort((a, b)=>a.timeBeforeDeparture - b.timeBeforeDeparture)
        .map((booking) => {
            return buildCartTrip(booking);
        })
        .join("");
    bookingsContainer.innerHTML = `<p id="title">My bookings</p>
                                    <div id="bookingList">${result}</div>
                                    <div id="bottomContainer">
                                        <div id="lineBlack"></div>
                                        <p id="textEnjoy">Enjoy your travels with TicketHack!</p>
                                    </div>`;
};

getbookings();
