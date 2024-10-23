let activeDiv = null;
export const setDiv = (newDiv) => {
    if (newDiv != activeDiv) {
        if (activeDiv) {
            activeDiv.style.display = "none";
        }
        newDiv.style.display = "block";
        activeDiv = newDiv;
    }
};

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
import { showRegister, handleLogin, handleRegister, handleLogoff } from "./handleLoginRegister.js";
import { handleTrips, showTrips } from "./trips.js";
import { handleAddEdit } from "./addEditDelete.js";

document.addEventListener("DOMContentLoaded", () => {
    token = localStorage.getItem("token");
    message = document.getElementById("message");
    // handleLogoClick();
    showRegister();
    handleLogin();
    handleTrips();
    handleRegister();
    handleAddEdit();
    if (token) {
        showTrips();
    };
    handleLogoff();
});

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