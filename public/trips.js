import { message, enableInput, token, setToken, inputEnabled, setDiv } from "./index.js";
import { handleAddEdit, deleteTrip, showAddEdit } from './addEditDelete.js';
import { handleLogoff } from "./handleLoginRegister.js";

let tripsDiv = document.getElementById("trips");
let tripsTable = document.getElementById("trips-table");
let tripsTableHeader = document.getElementById("trips-table-header");
const logoff = document.getElementById("logoff");
const addTrip = document.getElementById("add-trip");

export const handleTrips = () => {
    tripsDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addTrip) {
                showAddEdit(null);
            } else if (e.target === logoff) {
                handleLogoff();
            } else if (e.target.classList.contains("editButton")) {
                message.textContent = "";
                showAddEdit(e.target.dataset.id);
            } else if (e.target.classList.contains("deleteButton")) {
                message.textContent = "";
                deleteTrip(e.target.dataset.id);
            }

        }
    });
};

export const showTrips = async () => {
    try {
        enableInput(false);

        const response = await fetch("/trips", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        const registerForm = document.getElementById("register-form");
        const loginForm = document.getElementById("login-form");
        let msg = document.getElementById("trips-message");

        loginForm.style.display = "none";
        registerForm.style.display = "none";

        let children = [tripsTableHeader];

        if (response.status === 200) {

            if (data.count === 0) {
                msg.style.display = "inline";
                tripsTableHeader.style.display = "none";
                tripsTable.replaceChildren(...children);
                msg.textContent = "There is no trips planned yet."
            } else {
                // console.log(tripsTableHeader.style.display, "-----", tripsDiv.style.display);
                // tripsDiv.style.display = "inline";
                // tripsTableHeader.style.display = "inline";
                for (let i = 0; i < data.trips.length; i++) {
                    let rowEntry = document.createElement("tr");
                    let editButton = `<td><button type="button" class="editButton" data-id=${data.trips[i]._id}>Show trip</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.trips[i]._id}>Delete trip</button></td>`;
                    let rowHTML = `
                      <td>${data.trips[i].destination}</td>
                      <td>${convertDate(data.trips[i].startDate)}</td>
                      <td>${data.trips[i].duration}</td>
                      <td>${data.trips[i].reason}</td>
                      ${editButton}${deleteButton}`;

                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);

                }
                tripsTable.replaceChildren(...children);
            }
        } else {
            message.textContent = data.msg;
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(tripsDiv);
};

//convert date from DB format to readable
export const convertDate = (stringDate) => {
    const date = new Date(stringDate);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`

    return formattedDate;
}