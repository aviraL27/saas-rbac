const form = document.getElementById("auth-form");
const title = document.getElementById("form-title");
const toggle = document.getElementById("toggle-mode");
const errorMessage = document.getElementById("error-message");

let mode = "login";

/* ========= AUTO SWITCH MODE IF URL CONTAINS REGISTER ========= */

if (window.location.search.includes("mode=register")) {
  mode = "register";
  title.textContent = "Register";
}

/* ========= TOGGLE LOGIN / REGISTER ========= */

toggle.addEventListener("click", (e) => {
  e.preventDefault();

  mode = mode === "login" ? "register" : "login";
  title.textContent = mode === "login" ? "Login" : "Register";
  errorMessage.textContent = "";
});

/* ========= SUBMIT FORM ========= */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  errorMessage.textContent = "Processing...";

  const endpoint =
    mode === "login"
      ? "/api/auth/login"
      : "/api/auth/register";

  const { response, data } = await apiRequest(endpoint, "POST", {
    email,
    password
  });

  if (!response.ok) {
    errorMessage.textContent = data.message;
    return;
  }

  if (mode === "login") {
    setToken(data.token);
    window.location.href = "dashboard.html";
  } else {
    errorMessage.textContent = "Registered successfully. Please login.";
    mode = "login";
    title.textContent = "Login";
  }
});