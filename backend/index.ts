import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);


import "dotenv/config";
import { connectDB } from "./src/config/database";
import app from "./src/app";


const PORT = process.env.PORT || 3000

connectDB().then(() => {
   app.listen(PORT, () => {
    console.log("Server is running on PORT: ",PORT);
    
   });
});