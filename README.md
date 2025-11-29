# LexiFlow - Modern Dictionary App

LexiFlow is a modern, responsive dictionary web application built with vanilla JavaScript and Tailwind CSS. It allows users to search for words, view detailed definitions, listen to pronunciations, and explore synonyms and examples, powered by the free Dictionary API.

## Features

- 🔍 **Word Search**: Get detailed definitions, synonyms, and examples.
- 🔊 **Audio Pronunciation**: Listen to how words are pronounced.
- 🌓 **Dark/Light Mode**: Toggle between light and dark themes for comfortable reading.
- 📜 **Search History**: Keep track of your recently searched words.
- 💡 **Word of the Day**: Discover a new word every time you visit.
- 🎤 **Voice Search**: Search for words using your voice.
- 📱 **Responsive Design**: Fully responsive interface that works seamlessly on desktop and mobile devices.

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES Modules)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **API**: [Free Dictionary API](https://dictionaryapi.dev/)
- **Testing**:
  - [Jest](https://jestjs.io/) (Unit Testing)
  - [Playwright](https://playwright.dev/) (End-to-End Testing)
- **Server**: [http-server](https://www.npmjs.com/package/http-server)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ashishjaiswalcoder/Lexiflow.git
   cd Lexiflow
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the local development server:
   ```bash
   npm start
   ```
   This will start the server on port 8080 (by default).

2. Open your web browser and navigate to:
   ```
   http://127.0.0.1:8080
   ```

## Testing

### Unit Tests
Run the unit tests using Jest:
```bash
npm test
```

### End-to-End Tests
Run the E2E tests using Playwright:
```bash
npm run test:e2e
```

## Project Structure

```
Lexiflow/
├── src/
│   ├── css/            # Custom styles
│   └── js/
│       ├── api.js      # API handling logic
│       ├── main.js     # Application entry point and event listeners
│       ├── ui.js       # DOM manipulation and rendering
│       └── utils.js    # Utility functions
├── tests/              # Unit tests
├── index.html          # Main HTML entry point
├── package.json        # Project configuration and scripts
├── jest.config.js      # Jest configuration
└── playwright.config.cjs # Playwright configuration
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).
