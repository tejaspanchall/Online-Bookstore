# Bookstore Database

This file contains SQL scripts to create a PostgreSQL database for a bookstore application. The database includes tables for users, books, and user-book relationships.

## Database Schema

### Tables

1. **users**
    - `id` (SERIAL PRIMARY KEY) - Unique identifier for each user.
    - `firstname` (VARCHAR(50) NOT NULL) - First name of the user.
    - `lastname` (VARCHAR(50) NOT NULL) - Last name of the user.
    - `email` (VARCHAR(100) UNIQUE NOT NULL) - Unique email for each user.
    - `password` (VARCHAR(255) NOT NULL) - Hashed password of the user.
    - `reset_token` (VARCHAR(64)) - Token used for password reset.

2. **books**
    - `id` (SERIAL PRIMARY KEY) - Unique identifier for each book.
    - `title` (VARCHAR(255) NOT NULL) - Title of the book.
    - `image` (VARCHAR(255)) - URL or path of the book cover image.
    - `description` (TEXT) - Description or summary of the book.
    - `isbn` (VARCHAR(20) UNIQUE NOT NULL) - Unique ISBN of the book.
    - `author` (VARCHAR(100) NOT NULL) - Author of the book.

3. **user_books**
    - `user_id` (INTEGER REFERENCES users(id)) - Foreign key referencing `users.id`.
    - `book_id` (INTEGER REFERENCES books(id)) - Foreign key referencing `books.id`.
    - **Primary Key** (`user_id`, `book_id`) - Ensures a unique user-book relationship.

## SQL Scripts

To create the required tables, execute the following SQL scripts:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(64)
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    author VARCHAR(100) NOT NULL
);

CREATE TABLE user_books (
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    PRIMARY KEY (user_id, book_id)
);
```

## Setup Instructions

1. Install PostgreSQL on your system.
2. Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE bookstore;
   ```
3. Run the SQL script to create tables.