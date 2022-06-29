import { AxiosError } from "axios";
import { NextRouter, withRouter } from "next/router";
import React, { createContext, useMemo, useState } from "react";
import { AXIOS_INSTANCE, IS_CLIENT } from "../constants";

const initialState = {
	token: "",
	email: "",
	login: () => {},
	logout: () => {},
};

interface stateType {
	token: string | null;
	email: string | null;
	login: (token: string, email: string) => void;
	logout: Function;
}

if (IS_CLIENT) {
	const token = localStorage.getItem("token");
	const email = localStorage.getItem("email");
	if (token && email) {
		initialState.token = token;
		initialState.email = email;
	}
}

export const AuthContext = createContext<stateType>(initialState);

export const AuthContextWrapper = withRouter(
	({ children, router }: { children: React.ReactNode; router: NextRouter }) => {
		const [state, setState] = useState<stateType>(initialState);

		const login = (token: string, email: string) => {
			setState({
				...state,
				token,
				email,
			});
			localStorage.setItem("token", token);
			localStorage.setItem("email", email);
		};

		const logout = () => {
			AXIOS_INSTANCE.interceptors.request.use((req) => {
				if (req?.headers?.Authorization) req.headers.Authorization = "";
				return req;
			});
			localStorage.clear();
			setState({
				...state,
				token: null,
				email: null,
			});
		};
		useMemo(() => {
			AXIOS_INSTANCE.interceptors.response.use(
				(res) => res,
				(error: AxiosError) => {
					if (error.response?.status === 401) {
						logout();
						router.push(
							`/auth/login?next=${encodeURIComponent(router.asPath)}`
						);
					}
					return Promise.reject(error);
				}
			);

			AXIOS_INSTANCE.interceptors.request.use((req) => {
				console.log("token", state.token);

				if (state.token) {
					req.headers!.Authorization = `Token ${state.token}`;
				}
				return req;
			});
		}, [state.token]);
		return (
			<AuthContext.Provider
				value={{
					...state,
					login,
					logout,
				}}>
				{children}
			</AuthContext.Provider>
		);
	}
);
// export withRouter(AuthContextWrapper)
