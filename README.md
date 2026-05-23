# QUICKGPT

QUICKGPT is a full-stack AI-powered chatbot and content generation platform built using React, Node.js, Express, MongoDB, and Gemini/OpenAI APIs. The application provides users with an intelligent chat interface, AI-generated responses, authentication, payment integration, and modern responsive UI.

---

## Features

* AI Chatbot Integration
* Gemini & OpenAI API Support
* User Authentication & Authorization
* Responsive Modern UI
* Markdown Response Rendering
* Payment Integration with Stripe
* Image Storage using ImageKit
* Real-Time Chat Experience
* Secure Backend APIs

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Markdown
* PrismJS

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* BcryptJS
* Gemini API
* OpenAI API
* Stripe API

---

## Project Structure

```bash
QUICKGPT-main/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/QUICKGPT.git
cd QUICKGPT
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## Backend Setup

```bash
cd server
npm install
npm start
```

Backend will run on:

```bash
http://localhost:5000
```

---

## Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
STRIPE_SECRET_KEY=your_stripe_key
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

---

## Main Modules

### Authentication Module

* User Registration
* Login System
* JWT Security

### AI Chat Module

* AI-generated responses
* Markdown formatted answers
* Syntax highlighted code blocks

### Payment Module

* Stripe payment integration
* Premium feature support

### Media Management

* Image upload & storage using ImageKit

---

## API Integrations

* OpenAI API
* Google Gemini API
* Stripe API
* ImageKit API

---

## Screenshots

Add your screenshots here.

```md
![Home Page](screenshots/home.png)
![Chat Interface](screenshots/chat.png)
```

---

## Future Improvements

* Voice Assistant Support
* AI Image Generation
* Multi-language Support
* Chat History Storage
* Mobile App Version
* Dark/Light Theme Toggle

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

This project is developed for educational and learning purposes.

---

## Author

Developed by Debashis Behera.
