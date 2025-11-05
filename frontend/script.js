const loadHeader = async () => {
    try {
        const response = await fetch("header.html");
        if (!response.ok) throw new Error("Erreur HTTP " + response.status);

        const html = await response.text();
        document.querySelector("#header").innerHTML = html;
    } catch (err) {
        console.error("Erreur chargement header:", err);
    }
};

loadHeader();
