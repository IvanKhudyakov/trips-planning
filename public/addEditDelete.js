import { enableInput, inputEnabled, message, token, setDiv } from "./index.js";
import { showTrips, convertDate } from "./trips.js";


let addEditDiv = document.getElementById("edit-trip");
let destination = document.getElementById("destination");
let startDate = document.getElementById("startDate");
let duration = document.getElementById("duration");
let reason = document.getElementById("reason");
let addingTrip = document.getElementById("adding-trip");

export const handleAddEdit = () => {

    const editCancel = document.getElementById("edit-cancel");

    addEditDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addingTrip) {
                enableInput(false);

                let method = "POST";
                let url = "/trips";

                if (addingTrip.textContent === "Update") {
                    method = "POST";
                    url = `/trips/update/${addEditDiv.dataset.id}`;
                }

                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            destination: destination.value,
                            startDate: startDate.value,
                            duration: duration.value,
                            reason: reason.value,
                        }),
                    });

                    const data = await response.json();

                    if (response.status === 201 || response.status === 200) {
                        if (response.status === 201) {
                            // 201 indicates a successful create
                            message.textContent = "The trip entry was created.";
                        } else {
                            // 200 indicates a successful update
                            message.textContent = "The trip entry was updated.";

                        }
                        destination.value = "";
                        startDate.value = "";
                        duration.value = "";
                        reason.value = "leasure";

                        showTrips();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    // console.log(err);
                    message.textContent = "A communication error occurred.";
                }

                enableInput(true);
            } else if (e.target === editCancel) {
                message.textContent = "";
                showTrips();
            }
        }
    });
};

export const deleteTrip = async (tripId) => {
    if (!tripId) {
        message.textContent = "Trip was not found!";
        showTrips();
    } else {
        enableInput(false);

        try {
            const response = await fetch(`/trips/delete/${tripId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                message.style.display = "inline";
                message.textContent = data.msg;
                showTrips();
            }
        }
        catch {
            message.textContent = "A communications error has occurred.";
            showTrips();
        }
        enableInput(true);
    }
}

export const showAddEdit = async (tripId) => {
    if (!tripId) {
        destination.value = "";
        startDate.value = "";
        duration.value = "";
        reason.value = "leasure";
        addingTrip.textContent = "Add";
        message.textContent = "";

        setDiv(addEditDiv);
    } else {
        enableInput(false);

        try {
            const response = await fetch(`/trips/${tripId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                destination.value = data.trip.destination;
                startDate.value = convertDate(data.trip.startDate);
                duration.value = data.trip.duration;
                reason.value = data.trip.reason;
                addingTrip.textContent = "Update";
                message.textContent = "";
                addEditDiv.dataset.id = tripId;

                //Render weather    
                let parentWeatherElement = document.getElementById("weather-container");
                parentWeatherElement.innerHTML = "";
                let dates = [];
                let tempMin = [];
                let tempMax = [];
                data.forecast.forEach(daily => {
                    dates.push(daily.date);
                    tempMin.push(daily.temperatureMin);
                    tempMax.push(daily.temperatureMax);
                });
                //since the space is limited
                const iteration = Math.min(dates.length, 5);
                let forecastHeaderHTML = document.createElement("td");
                forecastHeaderHTML.innerHTML = `Weather forecast for the ${iteration} days in ${data.trip.destination}:`;
                parentWeatherElement.appendChild(forecastHeaderHTML);
                for (let i = 0; i < iteration; i++) {
                    let rowEntry = document.createElement("tr");
                    let rowHTML = `
                      <td>${dates[i]}:</td>
                      <td>Min temp: ${Math.round(tempMin[i])} °C;</td>
                      <td>Max temp: ${Math.round(tempMax[i])} °C.</td>`;

                    rowEntry.innerHTML = rowHTML;
                    parentWeatherElement.appendChild(rowEntry);
                }

                //Render checklist
                function addChapter(chapter) {
                    let forecastHeaderHTML = document.createElement("tr");
                    forecastHeaderHTML.innerHTML = `<h3>${chapter}</h3> <br>`;
                    return forecastHeaderHTML;
                }
                let parentChecklistElement = document.getElementById("checklist-container");
                parentChecklistElement.innerHTML = "";
                parentChecklistElement.appendChild(addChapter(`Recommended checklist`));
                const transportationUl = document.createElement('ul');
                const accommodationUl = document.createElement('ul');
                const planningUl = document.createElement('ul');
                const documentsUl = document.createElement('ul');
                const packagingUl = document.createElement('ul');
                
                function renderList(data, parent) {
                    const ul = document.createElement('ul');
                    for (const key in data) {
                        const li = document.createElement('li');
                        li.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
                        ul.appendChild(li);
                    }

                    parent.appendChild(ul);
                }


                //this is awful but it's 2:33 am lol
                renderList(data.checklist.transportation, transportationUl);
                renderList(data.checklist.accommodation, accommodationUl);
                renderList(data.checklist.planning, planningUl);
                renderList(data.checklist.documents, documentsUl);
                renderList(data.checklist.packaging.luggage, packagingUl);
                parentChecklistElement.appendChild(addChapter("transportation"));
                parentChecklistElement.appendChild(transportationUl);
                parentChecklistElement.appendChild(addChapter("accommodation"));
                parentChecklistElement.appendChild(accommodationUl);
                parentChecklistElement.appendChild(addChapter("planning"));
                parentChecklistElement.appendChild(planningUl);
                parentChecklistElement.appendChild(addChapter("documents"));
                parentChecklistElement.appendChild(documentsUl);
                parentChecklistElement.appendChild(addChapter("packaging"));
                parentChecklistElement.appendChild(packagingUl);

                setDiv(addEditDiv);
            } else {
                // might happen if the list has been updated since last display
                message.textContent = "The trip entry was not found";
                showTrips();
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communications error has occurred.";
            showTrips();
        }

        enableInput(true);
    }
};