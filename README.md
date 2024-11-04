# Assignment

Our simple cocktail app has a DB of cocktail recipies with a backend and front end to retrieve and show the cocktails. There are currently two views, a list cocktails view and add new cocktail view. In general we don't really care about styling, so keep it simple and no need to add fancy UI features. What we would like to see, is to add the following features:

- From the list page we want to navigate to a new view to see details on any selected cocktail. (We do not care about styling for this new view)
- Complete the "Search by description" functionality on the list page by adding a filter on the cocktail list based on description.
- On the new cocktail page, add feedback in case of API error. for example try to add a second 'Nojito', see how cocktail name has to be unique

# Submitting requirements

The project is expected to be delivered as a GitHub (or any other public git
hosting) repository URL. Please **DO NOT fork** this project.

# Bonus

Feel free to add one additional features for bonus points, here are some suggestions:

- Fuzzy Search on description and title using ElasticSearch (service is already installed)
- OpenAPI documentation of APIs
- Integration tests

# Provided boilerplate

https://github.com/eduard-wu/fullstack-nodejs-assessment

- Basic Vue3 front end with all required pages and views
- Basic NestJS Backend for existing page and connection to DB
- ElasticSearch is setup
- Basic list of recipes are present in database

# Getting Started

### Prerequisites

- Docker
- Node.js and npm (optional for local development)

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Rexben001/cocktails.git
   cd cocktails
   ```

2. **Run the Application** Use the Makefile to start the application with Docker. This will build and run the necessary Docker containers for the backend, frontend, and Elasticsearch.

   ```bash
   make start
   ```

3. **Stopping the Application**

   ```bash
   make stop
   ```

4. **Usage**

   #### Frontend

   Navigate to http://localhost:8080 to access the frontend.

   #### Backend

   The backend API is hosted at http://localhost:3000.

   #### API doc

   API documentation is automatically generated using Swagger and can be accessed at http://localhost:3000/api

5. **Testing**

   #### Backend E2E tests

   ```bash
   make test
   ```

   #### Frontend Unit Tests

   ```bash
   cd frontend && npm test
   ```
