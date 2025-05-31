# Wallet System Implementation 

A comprehensive wallet system with backend API for managing digital wallets and transactions.

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling library
- **dotenv** - Environment variable management

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB service

### Development Tools
- **Nodemon** - Development server with auto-restart
- **Postman** - API testing (collection included)

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **MongoDB Atlas account** (free tier available)
- **Git** (for version control)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone git@github.com:siddhi211/wallet-system-implementation.git
cd wallet-system-implementation
```
## 2. Install Dependencies
```bash
npm install
```
## 3. Set Up Environment Variables
Create a .env file in the root directory and add the following variables:
```bash
MONGODB_URI=your_mongodb_connection_string
```         
## 4. Run the Application
```bash
npm start
```
## 5. API Endpoints
The API endpoints are defined in the routes directory. You can use tools like Postman to test them. 

# Postman Collection
The Postman collection is included in the repository for easy API testing. Import the collection into Postman to explore the available endpoints.
