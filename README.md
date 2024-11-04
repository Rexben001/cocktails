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
