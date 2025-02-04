# BookCafe: Online Bookstore
![image](https://github.com/user-attachments/assets/1f3a54ff-38d9-474c-820d-8ff47e000b33)


## Features

- **Feature 1**: Login, Signup and Forgot password
- **Feature 2**: Book Catalog
- **Feature 3**: Search (Title, Author and ISBN)
- **Feature 4**: User's can add books.
- **Feature 5**: User's can add Books to his/her personal library.
- **Feature 6**: Pagination (10 Books/Page)
- **Feature 7**: Filter (A-Z, Z-A, Recently Added, Last Added)
- **Feature 8**: Role Based Access Control (Teacher and Student)
- **Feature 9**: Lazy Load

## Installation

To install and run this project locally, follow the steps below:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (for ReactJS development)
- [npm](https://www.npmjs.com/) (Node package manager)
- [PHP](https://www.php.net/) (for running the backend)
- [PostgreSQL](https://www.postgresql.org/) (for the database)
- [Composer](https://getcomposer.org/) (for PHP dependencies)
- [XAMPP](https://www.apachefriends.org/index.html) (for PHP server and managing the PostgreSQL database)

### Steps to Install Locally

1. **Clone the Repository**
   First, clone the repository to your local machine using the following command:
2. **Backend setup**:
   - Copy the `backend` folder into the `htdocs/online-bookstore` directory of XAMPP.
   - Start the Apache server using XAMPP's control panel.
   - Set up the PostgreSQL database and run any SQL scripts for migrations.
   - [Click me for database script](https://github.com/tejaspanchall/Online-Bookstore/blob/main/Database.md)
   - Update database credentials in `backend/config/database.php` file as necessary.
3. **Frontend setup**:
   - Install the dependencies with `npm install`.
   - Start the React development server using `npm start`.
4. **Access the project**:
   - The backend is available via `http://localhost/backend`.
   - The frontend is available via `http://localhost:3000`.
