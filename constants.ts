import axios from "axios";

export const EMAIL_REGEX = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

export const C_EASE_OUT = [0.6, -0.01, 0, 1];
export const DASHBOARD_CACHE = new Map();

export const SERVER_URL = "http://127.0.0.1:8000";
export const IS_CLIENT = typeof window !== "undefined";
export const AXIOS_INSTANCE = axios.create({
	baseURL: SERVER_URL,
	timeout: 5000,
});
const token = IS_CLIENT && localStorage.getItem("token");
AXIOS_INSTANCE.interceptors.request.use((req) => {
	if (token) req.headers!.Authorization = `Token ${token}`;
	return req;
});
// board id's
//  [WARNING] : these values should match the back-end
export const BACKLOG_ID = "backlog";
export const TODO_ID = "todo";
export const ONGOING_ID = "ongoing";
export const DONE_ID = "done";
