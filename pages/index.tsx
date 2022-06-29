import { useEffect } from "react";

export default function Index() {
	useEffect(() => {
		window.location.href = "/register";
	});
	return <div></div>;
}
