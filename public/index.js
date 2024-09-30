export let inputEnabled = true;
export const enableInput = (state) => {
    inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
    token = value;
    if (value) {
        localStorage.setItem("token", value);
    } else {
        localStorage.removeItem("token");
    }
};

export let message = null;
// import { showTrips, handleTrips } from "./trips.js";
import { showRegister, handleLogin, handleRegister, handleLogoff } from "./handleLoginRegister.js";
import { showTrips } from "./trips.js";
// import { handleAddEdit } from "./addEdit.js";

document.addEventListener("DOMContentLoaded", () => {
    token = localStorage.getItem("token");
    message = document.getElementById("message");
    // handleLogoClick();
    showRegister();
    handleLogin();
    handleRegister();
    handleLogoff();
});
// handleTrips();
// handleAddEdit();
// if (token) {
//     showTrips();
// } else {
//     showLoginRegister();
// }


// const handleLogoClick = () => {
//     const logo = document.getElementById("home-logo");
//     logo.addEventListener("click", () => {
//         if (!token) {
//             window.location.href = "/";
//         } else {
//             showTrips()
//         }
//     })

// }