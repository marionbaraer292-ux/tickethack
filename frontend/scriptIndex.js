const search = document.getElementById("search");
const formContainer = document.getElementById("formContainer");
const infoCard = document.getElementById("info-card");
const buttonSearch = document.getElementById("buttonSearch");
const inputDateTT = document.getElementById("inputDeparture");

const startInfoCard = `
                    <img src="./images/train.png" alt="train icon" />
                    <div id="lineGreen"></div>
                    <p>It’s time to book your future trip.</p>`;

const notFoundInfoCard = `
                    <img src="./images/notfound.png" alt="notfound icon" />
                    <div id="lineGreen"></div>
                    <p>No trips found.</p>`;

infoCard.innerHTML = startInfoCard;

let currentTrips = [];

const buildCardList = (trips, withDate = false) => {
    infoCard.style.justifyContent = "flex-start";
    infoCard.style.overflowY = "auto";
    infoCard.style.maxHeight = "20rem";
    infoCard.style.paddingRight = "1.5rem";
    const tripsLength = trips.length;
    const headSort = `
                        <div id="sortContainer">
                            <label for="sortSelect">Sort ${tripsLength} trip${
        tripsLength > 1 ? "s" : ""
    } by:</label>
                            <select id="sortSelect">
                                <option value="none">None</option>
                                <option value="date">Date</option>
                                <option value="price">Price</option>
                            </select>
                        </div>`;
    return (
        headSort +
        trips
            .map(
                (t) => `<div class="cardTrip">
                        <div class="cardInfo">
                            <p>${t.departure} > ${t.arrival}</p>
                            <p>${moment(t.date).format(
                                withDate ? "HH:mm" : "YYYY-MM-DD HH:mm"
                            )}</p>
                            <p>${t.price}€</p>
                        </div>
                        <button id="${t._id}" class="add">Book</button>
                    </div>
                    `
            )
            .join("")
    );
};

const renderTrips = (trips, withDate = false) => {
    infoCard.innerHTML = buildCardList(trips, withDate);

    if (!withDate) {
        document.querySelectorAll(".cardInfo").forEach((e) => {
            e.style.gap = "1rem";
        });
    }

    setAddCartEvents();

    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            const value = e.target.value;
            let sorted = [...currentTrips];

            if (value === "date") {
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else if (value === "price") {
                sorted.sort((a, b) => a.price - b.price);
            }

            renderTrips(sorted, withDate);
        });
    }
};

const getTrips = async (searchParams) => {
    const response = await fetch(`${ENV.API_URL}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParams),
    });
    const data = await response.json();

    if (!data.result) {
        infoCard.innerHTML = notFoundInfoCard;
        return;
    }

    currentTrips = data.trips;

    renderTrips(currentTrips, searchParams?.date ?? false);
};

const setAddCartEvents = () => {
    const addList = document.querySelectorAll(".add");
    addList.forEach((a) => {
        a.addEventListener("click", async () => {
            await fetch(`${ENV.API_URL}/carts/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tripId: a.id }),
            });
            await getTrips({});
        });
    });
};

buttonSearch.addEventListener("click", () => {
    const errorDate = document.getElementById("errorDate");
    if (errorDate) errorDate.remove();

    const inputDeparture = document.getElementById("inputDeparture");
    const inputArrival = document.getElementById("inputArrival");
    const inputDate = document.getElementById("inputDate");

    if (moment(inputDate.value).toDate() < new Date()) {
        formContainer.innerHTML += `<p id='errorDate' style='color: red;'>Date must be after today!</p>`;
        return;
    }

    const searchParams = {};
    if (inputDeparture) searchParams.departure = inputDeparture.value;
    if (inputArrival) searchParams.arrival = inputArrival.value;
    if (inputDate) searchParams.date = inputDate.value;

    getTrips(searchParams);
    inputDeparture.value = "";
    inputArrival.value = "";
    inputDate.value = "";
});
