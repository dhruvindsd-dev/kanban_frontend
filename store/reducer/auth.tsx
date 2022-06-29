// initial state

const token = IS_CLIENT && (localStorage.getItem("token") ?? "");
const firstName = IS_CLIENT && (localStorage.getItem("firstName") ?? "");

const initialState = {
	token,
	firstName,
	profileImg: "",
};
import { createSlice } from "@reduxjs/toolkit";
import { AXIOS_INSTANCE, IS_CLIENT } from "../../constants";

export const authStore = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, { payload: { firstName, token } }) => {
			state.token = token;
			state.firstName = firstName;

			localStorage.setItem("token", token);
			localStorage.setItem("firstName", firstName);
		},
		register: (state, { payload: { firstName, token } }) => {
			state.token = token;
			state.firstName = firstName;

			localStorage.setItem("token", token);
			localStorage.setItem("firstName", firstName);

			AXIOS_INSTANCE.interceptors.request.use((req) => {
				if (state.token) {
					req.headers!.Authorization = `Token ${token}`;
				}
				return req;
			});
		},

		updateProfileImg: (state, { payload }) => {
			state.profileImg = payload;
		},
	},
});

export const { login, register, updateProfileImg } = authStore.actions;

export default authStore.reducer;
