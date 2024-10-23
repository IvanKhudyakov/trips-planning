# Trips Planning

## CTD Final Project

### Project Concept
The **Trips Planning** tool is designed to help users organize their trips effectively. Its purpose is to simplify the preparation activities involved in planning trips.

### Features and Functionality
The project includes the following features:
- **User Authentication**: Register and authenticate users. **DONE** on both Front and Back
- **Trip Management**: Create, copy, delete, and update trips. **DONE** on backend, failed to make ADD and EDIT to work on the frontend.
- **Weather Forecasting**: Retrieve weather forecasts for trip destinations using a public API. **DONE** using external API and additional npm package (utils/weather.js)
- **Preparation Checklist**: Generate a list of preparation activities as a checklist. **DONE** recommendations with generated URLs based on trip information
- **Luggage Recommendations**: Get recommendations for packing and generate a checklist. **DONE** recommendations based on forecast and trip duration

### Data Models
- **Users**: 
  - Name
  - Last Name
  - Email
  - Home City
  - Password
- **Trips**: 
  - Destination
  - Duration
  - Start Date
  - Reason
  - Created By (1-n relationship to User)

### Getting Started
Follow the steps below to run the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/IvanKhudyakov/trips-planning

2. **Create a .env File**: Create a .env file in the root directory of the project with the following parameters:
   ```bash
    MONGO_URI=your_mongo_uri_here
    JWT_SECRET=your_jwt_secret_here
    JWT_LIFETIME=24h
    PORT=3000

3. **Install Dependencies**:Navigate to the project directory:
   ```bash
   cd trips-planning
   ```
    Then run 
   ```bash
   npm install
   ```

4. **Start the Server**:
   ```bash
   npm start