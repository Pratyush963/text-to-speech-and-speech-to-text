// Get buttons and result container
const speakerBtn = document.getElementById('speakerBtn');
const questionBtn = document.getElementById('questionBtn');
const questionResult = document.getElementById('questionResult');

// Simulated API call to fetch a document and read its content using text-to-speech
async function readDocument() {
    try {
        const response = await fetch('document.txt'); // Simulating API to fetch document
        const text = await response.text();
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    } catch (error) {
        console.error('Error fetching document:', error);
    }
}

// Function to listen to user's question and convert it to text
async function listenForQuestion() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        questionResult.innerHTML = 'Listening...';
    };

    recognition.onresult = async function(event) {
        const spokenText = event.results[0][0].transcript;
        questionResult.innerHTML = `You asked: "${spokenText}"`;
        
        const documentText = await fetch('document.txt').then(res => res.text());

        // Simple keyword search in the document
        const keywordFound = documentText.toLowerCase().includes(spokenText.toLowerCase());
        if (keywordFound) {
            questionResult.innerHTML += '<br>Answer: Your query matches content from the document.';
        } else {
            questionResult.innerHTML += '<br>Answer: No matching content found in the document.';
        }
    };

    recognition.onerror = function(event) {
        questionResult.innerHTML = 'Error occurred in recognition: ' + event.error;
    };

    recognition.onend = function() {
        questionResult.innerHTML += '<br>Listening ended.';
    };

    recognition.start();
}

// Event listeners
speakerBtn.addEventListener('click', readDocument);
questionBtn.addEventListener('click', listenForQuestion);
