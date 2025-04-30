import { useState } from "react";
import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
    readContract,
    waitForTransactionReceipt,
    writeContract,
} from "wagmi/actions";
import { config } from "./config";
import { abi } from "../contracts/abi";

function App() {
    const [mood, setMoodValue] = useState("");

    function getMood() {
        readContract(config, {
            // kontrattan veri okumamizi sagliyor
            abi,
            address: "0x5A1fB9F4d29FACfbD35c4A309d5494CCD79edf69",
            functionName: "get",
        })
            .then((result) => {
                setMoodValue(result);
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function setMood() {
        const moodValue = document.getElementById("data").value;
        writeContract(config, {
            // kontratta degisiklik yapiyor
            abi,
            address: "0x5A1fB9F4d29FACfbD35c4A309d5494CCD79edf69",
            functionName: "set",
            args: [moodValue],
        })
            .then((result) => {
                console.log(result); // Transaction hash
                waitForTransactionReceipt(config, {
                    // yaptigimiz islem tamamlaninca fisi donduruyor.
                    hash: result,
                }).then((result) => {
                    console.log(result); // Transaction receipt
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <h1>Hello World!</h1>
            <p>Mood: {mood}</p>
            <input type="text" id="data" />
            <button
                onClick={getMood}
                style={{
                    marginLeft: "10px",
                }}
            >
                Get Mood
            </button>
            <button
                onClick={setMood}
                style={{
                    marginLeft: "10px",
                    marginBottom: "10px",
                }}
            >
                Set Mood
            </button>
            <ConnectButton /> {/* RainbowKit cuzdan baglama butonu */}
        </>
    );
}

export default App;
