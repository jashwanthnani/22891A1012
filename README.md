# URL Shortener Project

## Overview
This project is a Full Stack URL Shortener web application. It allows users to shorten long URLs, track their expiry, and view detailed click statistics. The application includes a backend microservice and a responsive frontend built with React.

## Features
- Shorten long URLs with optional custom shortcodes.
- Default validity of 30 minutes for each shortened URL.
- View detailed click statistics including timestamp, referrer, and location.
- Frontend allows shortening up to 5 URLs at a time.
- Integrated logging middleware for both backend and frontend.

## Tech Stack
- **Backend:** Node.js, Express, In-memory storage
- **Frontend:** React, Material UI
- **Logging:** Custom Logging Middleware integrated with Test Server
- **API Testing:** Postman / Insomnia

## Backend APIs
1. **Create Short URL**
   - **POST** `/shorturls`
   - Request Body:
     ```json
     {
       "url": "https://example.com",
       "validity": 30,
       "shortcode": "abcd1"
     }
     ```
   - Response:
     ```json
     {
       "shortLink": "http://localhost:8080/abcd1",
       "expiry": "2025-01-01T00:30:00Z"
     }
     ```

2. **Redirect Short URL**
   - **GET** `/:shortcode`
   - Redirects to the original URL.

3. **Get Short URL Stats**
   - **GET** `/shorturls/:shortcode`
   - Response includes total clicks and click details.

## Frontend
- Shortener Page: Shorten up to 5 URLs concurrently.
- Stats Page: View statistics for each shortcode.

## Installation
1. Clone the repository.
2. **Backend**
   ```bash
   cd backend
   npm install
   node src/app.js