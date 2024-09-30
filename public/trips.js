import { message, enableInput, token, setToken } from "./index.js";

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
        const test = document.getElementById("test-trips");
        loginForm.style.display = "none";
        registerForm.style.display = "none";
        test.style.display = "inline";

        let msg = document.getElementById("message0");
        let msg1 = document.getElementById("message1");
        let msg2 = document.getElementById("message2");
        msg.textContent = "ewrewrewrewr";
        msg1.textContent = data.count;
        msg2.textContent = data.trips[0]._id;

        // let children = [tripsTableHeader];

        // if (response.status === 200) {
        //     if (data.count === 0) {
        //         tripsTable.replaceChildren(...children); // clear this for safety
        //     } else {
        //         for (let i = 0; i < data.trips.length; i++) {
        //             let rowEntry = document.createElement("tr");
        //             let editButton = `<td><button type="button" class="editButton" data-id=${data.trips[i]._id}>edit</button></td>`;
        //             let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.trips[i]._id}>delete</button></td>`;
        //             let rowHTML = `
        //           <td>${data.trips[i].destination}</td>
        //           <td>${convertDate(data.trips[i].startDate)}</td>
        //           <td>${data.trips[i].duration}</td>
        //           <td>${data.trips[i].reason}</td>
        //           <div>${editButton}${deleteButton}</div>`;

        //             rowEntry.innerHTML = rowHTML;
        //             children.push(rowEntry);
        //         }
        //         tripsTable.replaceChildren(...children);
        //     }
        // } else {
        //     message.textContent = data.msg;
        // }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
};