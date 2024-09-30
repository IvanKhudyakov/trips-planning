import { enableInput, inputEnabled, message, setToken } from "./index.js";
import { showTrips } from "./trips.js"

export const showRegister = () => {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const registerUrl = document.getElementById("register-link");

    registerUrl.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.display = "inline";
    });
};

export const handleLogin = () => {
    const loginForm = document.getElementById("login-form");
    const logon = document.getElementById("login-button");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    loginForm.addEventListener("click", async (e) => {
        e.preventDefault();
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === logon) {
                enableInput(false);

                try {
                    const response = await fetch("/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email.value,
                            password: password.value,
                        }),
                    });
                    //TODO: add proper error handling
                    const data = await response.json();
                    if (response.status === 200) {
                        message.textContent = `Logon successful.  Welcome, ${data.user.name}!`;
                        setToken(data.token);

                        email.value = "";
                        password.value = "";

                        showTrips();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.error(err);
                    message.textContent = "A communications error occurred.";
                }
                enableInput(true);
            }
        }

    });
};


export const handleRegister = () => {
    const registerForm = document.getElementById("register-form");
    const register = document.getElementById("register-button");
    registerForm.addEventListener("click", async (e) => {
        if (e.target === register) {
            console.log("test");
            // e.preventDefault();
            const name = document.getElementById("name");
            const lastname = document.getElementById("lastname");
            const homecity = document.getElementById("homecity");
            const email = document.getElementById("email1");
            const password1 = document.getElementById("password1");
            const password2 = document.getElementById("password2");
            if (password1.value != password2.value) {
                message.textContent = "The passwords entered do not match.";
            } else {
                enableInput(false);
                try {
                    const response = await fetch("/auth/register/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: name.value,
                            lastname: lastname.value,
                            homecity: homecity.value,
                            email: email.value,
                            password: password1.value,
                        }),
                    });

                    const data = await response.json();
                    if (response.status === 201) {
                        message.textContent = `Registration successful.  Welcome, ${data.user.name}!`;
                        setToken(data.token);

                        name.value = "";
                        lastname.value = "";
                        homecity.value = "";
                        email.value = "";
                        password1.value = "";
                        password2.value = "";

                        showTrips();
                    }
                    //not to display the password on the screen. The default message is unsecure: "Path `password` (`123`) is shorter than the minimum allowed length (6)."
                    else if (data.msg.includes("Path `password` ")) {
                        message.textContent = 'The password is shorter than the minimum allowed length (6).';
                    }
                    else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.error(err);
                    message.textContent = "A communications error occurred.";
                }

                enableInput(true);
            }

        }
    });
};


export const handleLogoff = () => {
    const logoff = document.getElementById("logoff");
    logoff.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "/";
    });
};