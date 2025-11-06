const cartContainer = document.getElementById("cartContainer");

const buildCartCard = (item) => {
    return `
            <div class="cardTrip">
                <p>${item.tripId.departure} > ${item.tripId.arrival}</p>
                <p>${moment(item.tripId.date).format("YYYY-MM-DD HH:mm")}</p>
                <p>${item.tripId.price}€</p>
                <button id="${item._id}" class="delete">X</button>
            </div>
    `;
};

const setDeleteEvents = () => {
    const deleteList = document.querySelectorAll(".delete");
    deleteList.forEach((d) => {
        d.addEventListener("click", async () => {
            await fetch(`${ENV.API_URL}/carts/${d.id}`, {
                method: "delete",
            });
            await getCartItems();
        });
    });
};

const buildCartContainer = (cartItems) => {
    let total = 0;
    const itemList = cartItems
        .map((item) => {
            total += item.tripId.price;
            return buildCartCard(item);
        })
        .join("");
    return `
                <p id="title">My cart</p>
                <div id="cartList">
                    ${itemList}
                </div>
                <div id="totalPriceContainer">
                    <div id="totalPrice">
                        <p>Total : ${total}€</p>
                        <button id="purchaseButton">Purchase</button>
                    </div>
                </div>
    `;
};

const getCartItems = async () => {
    const response = await fetch(`${ENV.API_URL}/carts`);
    const data = await response.json();
    const cartItems = data.cartItems;
    if (cartItems.length <= 0) {
        cartContainer.innerHTML = `
                <p>No tickets in your cart.</p>
                <p>Why not plan a trip?</p>`;
        return;
    }
    cartContainer.innerHTML = buildCartContainer(cartItems);
    setDeleteEvents();
    const purchaseButton = document.getElementById("purchaseButton");
    purchaseButton.addEventListener("click", async () => {
        await fetch(`${ENV.API_URL}/carts/pay`, {
            method: "POST",
        });
        await getCartItems();
    });
};

getCartItems();
