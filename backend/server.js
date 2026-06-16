import app from "./src/app.js"
import connectToDB from "./src/config/database.js";
// import {testAi} from "./src/services/ai.service.js";
import http from "http";
import {initSocket} from "./src/sockets/server.socket.js";
connectToDB()


// testAi();
app.get("/", (req, res) => {
  res.send("Backend is running on port 3000 ");
});

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(3000,()=>{
    console.log("Server is running on the port 3000 ");
    })

