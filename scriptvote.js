// Candidate list per position
const candidates = {
  president: ["Daniel Munga", "Andrew Matinga", "Moses Maitha"],
  chairperson: ["Daniel Munga", "Andrew Matinga", "Moses Maitha"],
  representative: ["Mary Munga", "Andrew Matinga", "Moses Maitha"]
};

// Initialize vote counts from localStorage or set to zero
function initializeVotes() {
  for (const role in candidates) {
    candidates[role].forEach(name => {
      const key = `${role}_${name}`;
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, "0");
      }
    });
  }
}

// Validate form selections
function validateForm() {
  const selects = document.querySelectorAll("#voteForm select");
  for (const select of selects) {
    if (select.value === "") {
      alert("Please select a candidate for each position.");
      return false;
    }
  }
  return true;
}

// Update vote counts in localStorage
function recordVotes() {
  const selects = document.querySelectorAll("#voteForm select");
  selects.forEach((select, index) => {
    const role = Object.keys(candidates)[index];
    const selected = select.value;
    const key = `${role}_${selected}`;
    const currentVotes = parseInt(localStorage.getItem(key), 10);
    localStorage.setItem(key, currentVotes + 1);
  });
}

// Display vote results
function displayResults() {
  const resultDiv = document.getElementById("voteResult");
  resultDiv.innerHTML = "<h3>Vote Tally</h3>";
  for (const role in candidates) {
    const title = role.charAt(0).toUpperCase() + role.slice(1);
    resultDiv.innerHTML += `<h4>${title}</h4><ul>`;
    candidates[role].forEach(name => {
      const key = `${role}_${name}`;
      const votes = localStorage.getItem(key);
      resultDiv.innerHTML += `<li>${name}: ${votes} votes</li>`;
    });
    resultDiv.innerHTML += "</ul>";
  }
}

// Handle form submission
document.getElementById("voteForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (validateForm()) {
    recordVotes();
    displayResults();
    alert("Your vote has been recorded!");
    this.reset();
  }
});

// Initialize and display on page load
initializeVotes();
displayResults();

// Show reset button if admin (simple check, can be improved)
const isAdmin = true; // Change to false to hide
if (isAdmin) {
  document.getElementById("resetVotes").style.display = "inline-block";
}

// Reset all votes
document.getElementById("resetVotes").addEventListener("click", function () {
  if (confirm("Are you sure you want to reset all votes?")) {
    for (const role in candidates) {
      candidates[role].forEach(name => {
        const key = `${role}_${name}`;
        localStorage.setItem(key, "0");
      });
    }
    displayResults();
    alert("All votes have been reset.");
  }
});