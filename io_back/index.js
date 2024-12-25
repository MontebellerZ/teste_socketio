const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");

const PORT = 3001;

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true,
        type: "application/json",
    })
);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", ["Content-Type", "x-access-token"]);
    next();
});

const server = http.createServer(app);
const io = socketIO(server);

app.get("/", (req, res) => {
    let mensagem = "salve";
    console.log(mensagem);
    res.send(mensagem);
});

io.on("connection", (socket) => {
    console.log("novo usuario", socket);

    socket.on("disconnect", () => {
        console.log("usuario desconectado");
    });

    socket.on("infoEvent", (info) => {
        io.to(info.room).emit("infoEvent", info.mensagem);

        // io.emit("infoEvent", info); //broadcast
        // socket.emit("infoEvent", info); //return to the sender
        // io.to("1").emit(info); //broadcast to room 1
        // io.to("1").to("2").emit(info); //broadcast to the room 1 and room 2
        // io.to(["1", "2"]).emit(info); //broadcast to room 1 and room 2
    });

    socket.on("connectRoom", (room) => {
        socket.join(room);
    });

    socket.on("leaveRoom", (room) => {
        socket.leave(room);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
