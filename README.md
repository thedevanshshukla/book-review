📚 Book Review Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application where users can sign up, log in, add books, and review books. This project demonstrates authentication, CRUD operations, API integration, and frontend/backend communication.

🌟 Features
User Authentication

Sign up with name, email (unique), and password (hashed with bcrypt)

Login with email & password

JWT token authentication for protected routes

Book Management

Add new books with: title, author, description, genre, published year

Edit or delete books (only by the user who added them)

View all books with pagination (5 books per page)

View detailed book page with reviews and average rating

Review System

Add reviews with rating (1–5 stars) and review text

Edit or delete your own reviews

View all reviews and average rating on book details page

🛠 Tech Stack
| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Backend  | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt   |
| Frontend | React, React Router, Context API, Axios, Bootstrap |
| Database | MongoDB Atlas                                      |
| Others   | Git, VS Code, Postman for API testing              |




🚀 Installation
1. Clone the repository
git clone https://github.com/thedevanshshukla/book-review.git
cd book-review

2. Backend Setup
cd backend
npm install


Create a .env file:

MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000


Start backend server:

npm run dev

3. Frontend Setup
cd ../frontend
npm install
npm start


Frontend will run on http://localhost:3000 and communicate with backend on http://localhost:5000.

🔗 API Endpoints
User Authentication
| Method | Endpoint              | Description           | Auth Required |
| ------ | --------------------- | --------------------- | ------------- |
| POST   | `/api/users/register` | Register a new user   | ❌             |
| POST   | `/api/users/login`    | Login & get JWT token | ❌             |
Books
| Method | Endpoint         | Description                                     | Auth Required |
| ------ | ---------------- | ----------------------------------------------- | ------------- |
| GET    | `/api/books`     | Get all books (pagination supported)            | ❌             |
| GET    | `/api/books/:id` | Get details of a single book (reviews included) | ❌             |
| POST   | `/api/books`     | Add a new book                                  | ✅             |
| PUT    | `/api/books/:id` | Update a book (only by creator)                 | ✅             |
| DELETE | `/api/books/:id` | Delete a book (only by creator)                 | ✅             |
Reviews
| Method | Endpoint                 | Description             | Auth Required |
| ------ | ------------------------ | ----------------------- | ------------- |
| POST   | `/api/reviews/:bookId`   | Add a review for a book | ✅             |
| PUT    | `/api/reviews/:reviewId` | Update your own review  | ✅             |
| DELETE | `/api/reviews/:reviewId` | Delete your own review  | ✅             |

Note: Authenticated routes require JWT token in the header:

Authorization: Bearer <your_token_here>

💻 Usage

Sign up a new account

Login to get access to protected features

Add a book (only when logged in)

View all books on home page

Click on a book to see details, reviews, and average rating

Add or edit your review (only one review per book per user)

Edit or delete your own books and reviews

✅ Notes

Only the creator of a book can edit or delete it

Only the author of a review can edit or delete it

Average rating is calculated automatically from all reviews

📝 Future Improvements

Search and filter books

Sorting by rating or year

Charts for review distribution

Dark/Light mode toggle


📂 Database Schema
User
{
  "name": "string",
  "email": "string",
  "password": "string (hashed)"
}

Book
{
  "title": "string",
  "author": "string",
  "description": "string",
  "genre": "string",
  "publishedYear": "number",
  "addedBy": "userId (ref)"
}

Review
{
  "bookId": "ref to Book",
  "userId": "ref to User",
  "rating": "number (1-5)",
  "reviewText": "string"
}

💡 License

This project is for educational purposes.
