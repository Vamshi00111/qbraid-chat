
# qbraid-chat VS Code Extension

## Overview

The `qbraid-chat` extension enables users to interact with the [qBraid API](https://docs.qbraid.com/api-reference/user-guide/introduction) directly from Visual Studio Code. This chat extension allows you to send chat messages to the qBraid API and stream responses in real-time. You can also select the model to use and authenticate with your API key.

## Features

- **Chat Interface**: Communicate with the qBraid API through a simple chat interface in VS Code.
- **API Key Authentication**: Securely authenticate using your personal API key.
- **Model Selection**: Choose from available models for your chat requests.
- **Real-time Interaction**: Send messages to the API and receive responses in real-time.

## Installation

### Pre-requisites

1. **Visual Studio Code**: Ensure you have the latest version of [VS Code](https://code.visualstudio.com/).
2. **Node.js**: Make sure [Node.js](https://nodejs.org/) is installed.

### Steps

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Compile the extension (if using TypeScript):
   ```bash
   npm run compile
   ```
5. Package the extension:
   ```bash
   vsce package
   ```
6. Install the generated `.vsix` file in VS Code:
   ```bash
   code --install-extension qbraid-chat-0.1.0.vsix
   ```

## Usage

1. Once installed, open the `qbraid-chat` extension in VS Code.
2. The extension will prompt you to enter your API key. You can retrieve this from your qBraid account.
3. Once authenticated, the chat interface will be ready to send and receive messages.
4. You can also select the model to use from the available models listed in the qBraid API.

## API Integration

- **POST /chat**: Send messages to the qBraid API and receive responses.
  - You will interact with this API endpoint for chat messages.
  
- **GET /chat/models**: Retrieve available models and choose the best fit for your tasks.

## Contributing

Feel free to open an issue or submit a pull request if you find any bugs or want to suggest new features!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- The qBraid API documentation was used for API integration: [qBraid API Documentation](https://docs.qbraid.com/api-reference/user-guide/introduction).
- [VS Code Extension API Documentation](https://code.visualstudio.com/api).
