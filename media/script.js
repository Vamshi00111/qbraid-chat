document.getElementById('submit-api-key').addEventListener('click', () => {
  const apiKey = document.getElementById('api-key').value;
  if (!apiKey) {
    alert('Please enter an API Key');
    return;
  }

  // Save the API key and proceed to model selection
  localStorage.setItem('api-key', apiKey);
  loadModelSelection();
});

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
      models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.model;
        option.textContent = `${model.model}: ${model.description}`;
        modelSelect.appendChild(option);
      });

      const modelContainer = document.getElementById('model-selection');
      modelContainer.innerHTML = '';
      modelContainer.appendChild(modelSelect);
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

function showChatInterface() {
  const apiKeyContainer = document.getElementById('api-key-container');
  const modelSelectionContainer = document.getElementById('model-selection');
  const chatContainer = document.getElementById('chat-container');

  apiKeyContainer.style.display = 'none';
  modelSelectionContainer.style.display = 'none';
  chatContainer.style.display = 'block';
}

document.getElementById('send-message').addEventListener('click', () => {
  const message = document.getElementById('chat-input').value;
  const apiKey = localStorage.getItem('api-key');
  const selectedModel = localStorage.getItem('selected-model');
  
  if (!message) {
    alert('Please enter a message');
    return;
  }

  const requestBody = {
    prompt: message,
    model: selectedModel
  };

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
      const chatBox = document.getElementById('chat-box');
      chatBox.innerHTML += `<div class="message client">${message}</div>`;
      chatBox.innerHTML += `<div class="message server">${response.content}</div>`;
      document.getElementById('chat-input').value = ''; // Clear input
      chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    })
    .catch(err => console.error(err));
});
