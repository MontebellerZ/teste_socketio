import "./App.css";
import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

function App() {
    const [teste, setTeste] = useState();
    const [socket, setSocket] = useState();
    const [salas, setSalas] = useState([]);

    const emitAll = () => {
        socket.emit("infoEvent", { room: salas, mensagem: `salve salas ${salas.join(", ")}` });
    };

    const connectRoom = (room) => {
        socket.emit("connectRoom", room);
        setSalas((s) => [...s, room]);
    };

    const leaveRoom = (room) => {
        socket.emit("leaveRoom", room);
        setSalas((s) => {
            let ns = [...s];
            ns.splice(
                ns.findIndex((a) => a === room),
                1
            );
            return ns;
        });
    };

    useEffect(() => {
        const socket = socketIOClient("http://localhost:3001", { transports: ["websocket"] });

        socket.on("infoEvent", (info) => {
            setTeste(info);
            console.log("a");
        });

        setSocket(socket);
    }, []);

    return (
        <div className="App">
            <div>{teste || "Sem teste patrão"}</div>
            {["1", "2"].map((i) => {
                return (
                    <button
                        key={i}
                        onClick={() => {
                            salas.includes(i) ? leaveRoom(i) : connectRoom(i);
                        }}
                        style={salas.includes(i) ? { backgroundColor: "lime" } : {}}
                    >
                        {i}
                    </button>
                );
            })}
            <button onClick={emitAll}>all</button>
        </div>
    );
}

export default App;
