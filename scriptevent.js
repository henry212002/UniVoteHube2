
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const resultDiv = document.getElementById("bookingResult");
  const countdownDisplay = document.getElementById("countDownDisplay");
  const displayEventName = document.getElementById("displayEventName");
  const countdown = document.getElementById("countdown");

  // Utility: Generate 6-digit ticket number
  const generateTicketNumber = () => Math.floor(100000 + Math.random() * 900000);

  // Utility: Validate phone number format
  const isValidPhone = (phone) => /^\+254\d{9}$/.test(phone);

  // Utility: Format date
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  // Countdown Timer
  const startCountdown = (eventDate) => {
    const targetDate = new Date(eventDate);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        countdown.textContent = "Event is happening now!";
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      countdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
    }, 1000);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const eventName = document.getElementById("event").value.trim();
    const TNNPtickets = parseInt(document.getElementById("TNNPtickets").value);
    const phone = document.getElementById("phonenumber").value.trim();
    const eventDate = document.getElementById("eventDate").value;

    // Validate phone
    if (!isValidPhone(phone)) {
      alert("Please enter a valid Kenyan phone number (+254XXXXXXXXX)");
      return;
    }

    // Generate ticket number
    const ticketNumber = generateTicketNumber();

    // Store booking in localStorage
    const booking = {
      name,
      eventName,
      TNNPtickets,
      phone,
      eventDate,
      ticketNumber
    };
    localStorage.setItem(`booking_${ticketNumber}`, JSON.stringify(booking));

    // Show popup
    alert(`You have booked ${TNNPtickets} ticket(s) for "${eventName}".`);

    // Print ticket
    resultDiv.innerHTML = `
      <h3>🎟️ Your TNNP Ticket</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Event:</strong> ${eventName}</p>
      <p><strong>TNNPTickets:</strong> ${TNNPtickets}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Date & Time:</strong> ${formatDate(eventDate)}</p>
      <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
    `;

    // Simulate SMS message
    console.log(`SMS to ${phone}: Your ticket number for "${eventName}" is ${ticketNumber}`);

    // Show countdown
    countdownDisplay.classList.remove("hidden");
    displayEventName.textContent = `Countdown to "${eventName}"`;
    startCountdown(eventDate);

    // Reset form
    form.reset();
  });
});
const nameInput = document.getElementById("name");
const eventInput = document.getElementById("event");
const ticketsInput = document.getElementById("tickets");
const phoneInput = document.getElementById("phoneNumber");
const submitBtn = document.querySelector("button[type='submit']");

const nameFeedback = document.getElementById("nameFeedback");
const eventFeedback = document.getElementById("eventFeedback");
const ticketsFeedback = document.getElementById("ticketsFeedback");
const phoneFeedback = document.getElementById("phoneFeedback");

const isValidPhone = (phone) => /^\+254\d{9}$/.test(phone);

const validateForm = () => {
  let valid = true;

  // Name
  if (nameInput.value.trim().length < 2) {
    nameFeedback.style.display = "inline";
    nameInput.style.borderColor = "red";
    valid = false;
  } else {
    nameFeedback.style.display = "none";
    nameInput.style.borderColor = "green";
  }

  // Event
  if (eventInput.value.trim().length < 2) {
    eventFeedback.style.display = "inline";
    eventInput.style.borderColor = "red";
    valid = false;
  } else {
    eventFeedback.style.display = "none";
    eventInput.style.borderColor = "green";
  }

  // Tickets
  const tickets = parseInt(ticketsInput.value);
  if (isNaN(tickets) || tickets < 1) {
    ticketsFeedback.style.display = "inline";
    ticketsInput.style.borderColor = "red";
    valid = false;
  } else {
    ticketsFeedback.style.display = "none";
    ticketsInput.style.borderColor = "green";
  }

  // Phone
  const phone = phoneInput.value.trim();
  if (!isValidPhone(phone)) {
    phoneFeedback.style.display = "inline";
    phoneInput.style.borderColor = "red";
    valid = false;
  } else {
    phoneFeedback.style.display = "none";
    phoneInput.style.borderColor = "green";
  }

  submitBtn.disabled = !valid;
};

// Attach listeners
[nameInput, eventInput, ticketsInput, phoneInput].forEach(input => {
  input.addEventListener("input", validateForm);
});