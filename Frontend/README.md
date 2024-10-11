# Unus - AI Agent Management Platform

Unus is a web application for managing and running inference on AI agents. This README will guide you through setting up, developing, and using the application.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Available Scripts](#available-scripts)
6. [Deployment](#deployment)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- User authentication (login/register)
- AI agent repository management
- Running inference on AI agents
- Account settings management

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Python (v3.8 or later) for the backend
- PostgreSQL database

## Getting Started

To get a local copy up and running, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/unus.git
   cd unus
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Set up the backend:
   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

4. Set up your environment variables:
   - Create a `.env` file in the root directory
   - Add necessary environment variables (refer to `.env.example`)

5. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
unus/
├── src/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   └── App.js
├── backend/
├── public/
├── .env
├── package.json
└── README.md
```

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App setup

## Deployment

For deployment instructions, please refer to the [deployment guide](docs/deployment.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.