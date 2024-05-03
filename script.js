// Initialize speech recognition
const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

// Handle button click event for speech recognition
document.getElementById('speechRecognitionButton').addEventListener('click', function() {
    recognition.start();
    alert("Listening... Speak your question.");
});

// Event listener for speech recognition result
recognition.onresult = function(event) {
    const result = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    const questionnz1 = result;
    // Send the question to Dialogflow
    sendToDialogflow(questionnz1);
};

// Event listener for speech recognition error
recognition.onerror = function(event) {
    alert("Error occurred during speech recognition. Please try again.");
    recognition.stop();
};

// Function to send the question to Dialogflow
async function sendToDialogflow(question) {
    // Send the question to the server
    fetch('http://localhost:3000/webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: question })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response from the server
        const responseText = data.response;
        // Speak the response out loud
        speakResponse(responseText);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error occurred while processing your request. Please try again later.");
    });
}

// Function to send the question to Dialogflow
async function sendToDialogflow(question) {
    // Send the question to the server
    fetch('http://localhost:3000/webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: question })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response from the server
        const responseText = data.response;
        // Speak the response out loud
        speakResponse(responseText);
        // Show an alert with the response
        alert("Response from server: " + responseText);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error occurred while processing your request. Please try again later.");
    });
}

// Function to speak the response out loud
function speakResponse(responseText) {
    const utterance = new SpeechSynthesisUtterance(responseText);
    speechSynthesis.speak(utterance);
}


























// BURNS NAV
function BopenNav() {
    document.getElementById("BmyNav").style.width = "100%";
}
function BcloseNav() {
    document.getElementById("BmyNav").style.width = "0%";
}
// CUTS NAV
function CopenNav() {
    document.getElementById("CmyNav").style.width = "100%";
}
function CcloseNav() {
    document.getElementById("CmyNav").style.width = "0%";
}

function toggleShadow() {
    var burnsButton = document.getElementById('burnsButton');
    burnsButton.classList.toggle('no-shadow');
}


var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
