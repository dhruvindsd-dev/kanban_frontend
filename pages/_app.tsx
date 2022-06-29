import { configureStore } from "@reduxjs/toolkit";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import authStore from "../store/reducer/auth";
import "../styles/globals.scss";

const store = configureStore({ reducer: { auth: authStore } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
