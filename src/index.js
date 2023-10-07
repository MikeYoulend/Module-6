import React from "react";
import { createRoot } from "react-dom/client"; // Importa createRoot da "react-dom/client"
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import App from "./App";

const store = configureStore({
	reducer: rootReducer,
	// Altre configurazioni dello store, se necessario
});

const root = document.getElementById("root");
const reactRoot = createRoot(root);

reactRoot.render(
	<Provider store={store}>
		<App />
	</Provider>
);
