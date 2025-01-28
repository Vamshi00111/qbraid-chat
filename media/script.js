// Event listener to handle API key submission
document.getElementById('submit-api-key').addEventListener('click', () => {
  const apiKey = document.getElementById('api-key').value;
  if (!apiKey) {
    alert('Please enter an API Key'); // Prompt the user if no API key is entered
    return;
  }
  // Save the API key and proceed to model selection
  localStorage.setItem('api-key', apiKey);
  loadModelSelection();
});

// Fetch models from the API to allow the user to choose one
function loadModelSelection() {
  fetch('https://api.qbraid.com/api/chat/models', {
    method: 'GET',
    headers: {
      'api-key': localStorage.getItem('api-key')
    }
  })
    .then(response => response.json())
    .then(models => {
      const modelSelect = document.createElement('select');
      // Create a dropdown list for models
      models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.model;
        option.textContent = `${model.model}`;
        modelSelect.appendChild(option);
      });

      // Update the model selection UI
      const modelContainer = document.getElementById('model-selection');
      modelContainer.innerHTML = ''; // Clear previous models
      modelContainer.appendChild(modelSelect);

      // Button to confirm the model selection
      const modelButton = document.createElement('button');
      modelButton.textContent = 'Select Model';
      modelButton.addEventListener('click', () => {
        const selectedModel = modelSelect.value;
        localStorage.setItem('selected-model', selectedModel);
        showChatInterface();
      });
      modelContainer.appendChild(modelButton);
    })
    .catch(err => console.error(err));
}

// Show the chat interface after model selection
function showChatInterface() {
  const apiKeyContainer = document.getElementById('api-key-container');
  const modelSelectionContainer = document.getElementById('model-selection');
  const chatContainer = document.getElementById('chat-container');

  // Hide API key and model selection
  apiKeyContainer.style.display = 'none';
  modelSelectionContainer.style.display = 'none';
  // Show chat interface
  chatContainer.style.display = 'block';
}

// Event listener to handle sending a message
document.getElementById('send-message').addEventListener('click', () => {
  const sendButton = document.getElementById('send-message');
  const message = document.getElementById('chat-input').value;
  const apiKey = localStorage.getItem('api-key');
  const selectedModel = localStorage.getItem('selected-model');
  const chatBox = document.getElementById('chat-box');

  if (!message) {
    alert('Please enter a message'); // Check if a message was entered
    return;
  }

  // Disable send button during the request
  sendButton.disabled = true;
  sendButton.style.backgroundColor = 'grey';

  const requestBody = {
    prompt: message,
    model: selectedModel
  };

  // Send the user's message to the API
  fetch('https://api.qbraid.com/api/chat', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(response => {
      // Add the user's message to the chat
      chatBox.innerHTML += `<div class="message client">${message}</div>`;
      // Parse and add the server response
      chatBox.innerHTML += `<div class="message server">${parseChatResponse(response.content)}</div>`;
      document.getElementById('chat-input').value = ''; // Clear input field
      chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    })
    .catch(err => console.error(err))
    .finally(() => {
      // Enable send button and restore its original style
      sendButton.disabled = false;
      sendButton.style.backgroundColor = '#10a37f';
    });
});

// Function to format the server response content
function parseChatResponse(responseContent) {

  // Match and format code blocks
  const codeRegex = /```(.*?)```/gs;
  const headingRegex = /### (.*)/g; // Match headings
  
  responseContent = responseContent.replace(codeRegex, (match, code) => {
    return `<pre class="code-block">${code}</pre>`;
  });

  // Format headings
  responseContent = responseContent.replace(headingRegex, (match, heading) => {
    return `<h3 class="response-heading">${heading}</h3>`;
  });

  // Replace new lines with <br> for line breaks
  responseContent = responseContent.replace(/\n/g, '<br>');

  return responseContent;
}
