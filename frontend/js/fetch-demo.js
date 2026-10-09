button.addEventListener("click", ()=> fetchData("users"));
const resultsContainer = document.getElementById("results");
button2.addEventListener("click", ()=> fetchData("posts"));

async function fetchData(endpoint) {
    resultsContainer.textContent = "Loading...";

    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/${endpoint}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
            console.log(response);
        const data = await response.json();
            console.log(data);
        resultsContainer.innerHTML = "";
        data.forEach(item => {
            const element = document.createElement("p");
            element.textContent = item.name || item.title;

            resultsContainer.appendChild(element);
        });

       

    } catch (error) {
        resultsContainer.textContent = "Sorry, something went wrong.";
        console.log(error);
    }
}