import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ChatLauncher from "./components/ChatLauncher";
import { initSSE } from './lib/sse';
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <ChatLauncher />
  </BrowserRouter>
);

initSSE();
 