/* Contact form validation — no backend here, so this checks the fields,
   shows clear inline errors, and simulates a successful send. Wire this
   up to a real endpoint (Formspree, your own API, etc.) when you host it. */

(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var status = document.getElementById("formStatus");

  var fields = {
    name: { input: document.getElementById("nameInput"), error: document.getElementById("nameError") },
    email: { input: document.getElementById("emailInput"), error: document.getElementById("emailError") },
    phone: { input: document.getElementById("phoneInput"), error: document.getElementById("phoneError") },
    message: { input: document.getElementById("messageInput"), error: document.getElementById("messageError") }
  };

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_PATTERN = /^\d+$/;

  function setError(field, message) {
    field.input.closest(".field").classList.toggle("has-error", Boolean(message));
    field.error.textContent = message || "";
  }

  function validate() {
    var ok = true;

    if (fields.name.input.value.trim() === "") {
      setError(fields.name, "Please enter your name.");
      ok = false;
    } else {
      setError(fields.name, "");
    }

    var emailVal = fields.email.input.value.trim();
    if (emailVal === "") {
      setError(fields.email, "Please enter your email.");
      ok = false;
    } else if (!EMAIL_PATTERN.test(emailVal)) {
      setError(fields.email, "That email address doesn't look right.");
      ok = false;
    } else {
      setError(fields.email, "");
    }

    var phoneVal = fields.phone.input.value.trim();
    if (phoneVal === "") {
      setError(fields.phone, "Please enter your phone number.");
      ok = false;
    } else if (!PHONE_PATTERN.test(phoneVal)) {
      setError(fields.phone, "Digits only, please — no spaces or dashes.");
      ok = false;
    } else {
      setError(fields.phone, "");
    }

    if (fields.message.input.value.trim() === "") {
      setError(fields.message, "Please write a short message.");
      ok = false;
    } else {
      setError(fields.message, "");
    }

    return ok;
  }

  // Validate a field as soon as the visitor leaves it
  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener("blur", validate);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.classList.remove("is-visible", "success", "error");

    if (!validate()) {
      status.textContent = "Fix the highlighted fields and try again.";
      status.classList.add("is-visible", "error");
      return;
    }

    // No backend wired up yet — this is where a real fetch() to your
    // server or a form service would go.
    status.textContent = "Message received — " + fields.name.input.value.trim() + ", I'll get back to you soon.";
    status.classList.add("is-visible", "success");
    form.reset();
  });
})();
