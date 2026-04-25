# Chat Application

## Tech Stack
- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- WebSocket for real-time communication
- Docker for containerization

## Architecture Diagram
![Architecture Diagram](link-to-diagram)

## Multi-Platform Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rishiraj029/Chat-App.git
   cd Chat-App
   ```
2. **Setup Backend:**
   - Navigate to the backend folder
   - Run `npm install` to install dependencies
   - Create a `.env` file and add the necessary environment variables
3. **Setup Frontend:**
   - Navigate to the frontend folder
   - Run `npm install`
   - Start the application with `npm start`

## Environment Variables
- `MONGO_URI`: MongoDB connection string
- `PORT`: Port number for the server
- `JWT_SECRET`: Secret key for JSON Web Tokens

## Docker Deployment
1. Build the Docker image:
   ```bash
   docker build -t chat-app .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 chat-app
   ```

## Real-Time Communication Flow
- The frontend establishes a WebSocket connection to the server upon loading.
- Messages are listened for via WebSocket and displayed in real-time in the UI.

## Security Features
- JWT for secure user authentication
- Input validation to prevent SQL injection and XSS attacks
- HTTPS for secure data transmission

## Conclusion
This Chat Application is designed to provide real-time chat functionalities with a focus on security and scalability. Perfect for internship applications!