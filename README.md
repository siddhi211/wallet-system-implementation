# Wallet System Implementation (https://pro-wallet-system.netlify.app/)

## Core Features
1. Wallet Management : Create wallet with name and initial balance
2. Transactions : Credit/Debit operations with balance validation
3. Transaction History : View, sort, paginate, and export to CSV
4. Balance Formatting : Comma-separated display
5. Error Handling : Prevents overdrafts with popup alerts
6. Session Management : localStorage persistence with logout functionality

## Data Flow
1. User creates wallet → stored in MongoDB + localStorage
2. Transactions update wallet balance and create transaction records
3. Frontend fetches data via REST API calls
4. State management handles UI updates and conditional rendering

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling library
- **dotenv** - Environment variable management

### Frontend        
- **React.js** - JavaScript library for building user interfaces
- **React Router** - Library for routing in React applications
- **Axios** - Promise-based HTTP client for making API requests

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB service

### Hosting
Backend API is hosted on Railway. - https://wallet-system-backend-production-95e2.up.railway.app/<API-ENDPOINTS>
Frontend is hosted on Vercel - https://pro-wallet-system.netlify.app/
 
## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **MongoDB Atlas account** (free tier available)
- **Git** (for version control)

## Local Setup Instructions

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
# In Backend:
```bash
MONGODB_URI=your_mongodb_connection_string
``` 
# In Frontend:
```bash
REACT_APP_API_URL=your_backend_api_url
```        
## 4. Run the Application (Both Backend and Frontend)
```bash
npm start
```
## 5. API Endpoints
- POST /api/wallet/setup - Create wallet
- POST /api/wallet/transact/:walletId - Execute transaction
- GET /api/wallet/transactions - Fetch transaction history
- GET /api/wallet/wallet/:id - Get wallet details

![image](https://github.com/user-attachments/assets/e6663b75-3c62-49dc-98c9-e90cf4d2f87a)
![image](https://github.com/user-attachments/assets/3fc68e60-74ef-4c51-932b-dd8ac848efd3)
![image](https://github.com/user-attachments/assets/7ec1296c-5150-4a57-9074-2850ef457838)
![image](https://github.com/user-attachments/assets/62d43f9f-ef2a-47dd-b562-952ba32cf025)
![image](https://github.com/user-attachments/assets/9024132c-2fbd-4589-b2b9-3202fb610e2c)
![image](https://github.com/user-attachments/assets/a8b1ebe8-4911-41ef-9612-275e2c563c4e)
![image](https://github.com/user-attachments/assets/1870773b-bb03-406d-bf0a-31c5f801fa48)
![image](https://github.com/user-attachments/assets/eae8777f-cfca-4916-968b-3da65f86bb5b)

# Postman Collection
The Postman collection is included in the repository for easy API testing. Import the collection into Postman to explore the available endpoints.

