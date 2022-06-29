import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

interface LoginOnFirstLoadProps {
	children: React.ReactNode;
}

const LoginOnFirstLoad = ({ children }: LoginOnFirstLoadProps) => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (!(token && firstName)) return;
		console.log("token from first lolad ", token);
	}, []);

	return <>{children}</>;
};
export default LoginOnFirstLoad;
