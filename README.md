# Notes App Backend API

## Introduction

This backend API serves as the backbone for the Notes App. It provides various utilities such as user authentication, sign-in, signup features, note sharing, searching, along with note creation, updation, and deletion.

## Installation

1. Clone the repository:

   git clone projecturl

2. Install project dependencies and start the development environment:

   npm install


3. Configure environment variables:

   - Create a `.env` file.
   - Copy fields from `.example.env`.
   - Set up required environment variables such as database connection details and other configurations.

4. Start the development environment:

   npm run dev


## Usage

To interact with the backend API, use Postman API Tester or any other API testing tool. The following are the available endpoints:

- **Authentication Endpoints:**
  - `POST /api/auth/signup`: Create a new user account.
  - `POST /api/auth/login`: Log in to an existing user account and receive an access token.

- **Note Endpoints:**
  - `GET /api/notes`: Get a list of all notes for the authenticated user.
  - `GET /api/notes/:id`: Get a note by ID for the authenticated user.
  - `POST /api/notes`: Create a new note for the authenticated user.
  - `PUT /api/notes/:id`: Update an existing note by ID for the authenticated user.
  - `DELETE /api/notes/:id`: Delete a note by ID for the authenticated user.
  - `POST /api/notes/:id/share`: Share a note with another user for the authenticated user.
  - `GET /api/search?q=:query`: Search for notes based on keywords for the authenticated user.

  **Sample Body for Signup:**
  ```json
  {
    "email": "firstaccount@gmail.com",
    "name": "first",
    "password": "password123",
    "confirm_password": "password123"
  }
  ```

  **Sample Body for Sign In:**
  ```json
  {
    "email": "firstaccount@gmail.com",
    "password": "password123"
  }
  ```

  **Sample Body for Posting Note:**
  ```json
  {
    "nheading": "This is my first custom note",
    "ncontent": "This is the content of my note."
  }
  ```

  **Sample Body for Updating Note:**
  ```json
  {
    "nheading": "This is my first updated note",
    "ncontent": "The updated content of the note."
  }
  ```

  **Sample Body for Sharing Note:**
  ```json
  {
    "sharedUserId": "123123123"
  }
  ```

  **Sample Params for Search Query:**
  eg: http://localhost:8000/api/search?q=this+is+my
  - Key: `q`
  - Value: `example+value`


## why I choosed MongoDB and Express

- **MongoDB:**
  - Flexible and scalable NoSQL database solution.
  - JSON-like document structure for diverse and evolving data.
  - Data models are changable at any point of time

- **Express:**
  - Minimal and flexible Node.js web application framework.
  - Middleware system for enhanced functionality.
  - availablity of large number of libraries 

## Additional Features

- **Rate Limiting:**
  - Implemented to prevent abuse and ensure fair usage.

- **Request Throttling:**
  - Throttling to control the rate of incoming requests for a smooth and reliable performance.
