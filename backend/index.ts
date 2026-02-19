import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);


import "dotenv/config";
import { connectDB } from "./src/config/database";
import app from "./src/app";
import { createServer } from "http"
import { initializeSocket } from "./src/utils/socket";



const PORT = Number(process.env.PORT) || 3000

const httpServer = createServer(app)

initializeSocket(httpServer)

connectDB()
  .then(() => {
     httpServer.listen(PORT, "0.0.0.0", () => {
      console.log("Server is running on PORT:", PORT);
     });
}).catch ((error) => {
   console.log("Failed to start server: ", error);
   process.exit(1);
})