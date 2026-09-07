# AI Resume Generator

An AI-powered resume generator built with React, Node.js, Express, and the Gemini API.

The application allows users to enter their personal, educational, project, experience, certification, and skill information and generate a professional, ATS-friendly resume using AI.

## Features

- Generate professional resumes using Gemini API
- AI-powered professional summary
- ATS-friendly resume content
- Job-description-based resume tailoring
- Education, experience, projects, and certifications
- Skills section
- Resume preview
- Print / Save as PDF
- Responsive web interface
- Secure Gemini API key configuration using environment variables

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- CORS
- dotenv
- Google Gemini API

## Project Structure

```text
resume-generator/
├── client/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── prompts/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
