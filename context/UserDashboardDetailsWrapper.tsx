import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { AXIOS_INSTANCE, LOCALSTORAGE_SELECTED_OUTLET_ID } from "../constants";

interface stateType {
	isRegisterComplete: boolean;
	role: "staff" | "owner" | "customer";
	selectedOutletId: number | null;
	outlets:
		| {
				salon_name: string;
				id: number;
				location: { city: string; state: string; locality: string; pincode: string };
				img: string | null;
		  }[]
		| [];
	updateState: (key: keyof stateType, value: any) => void;
}

const initialState: stateType = {
	isRegisterComplete: false, // is the user quits after registering then redirect him back to the phase 2 and 3 for getting the salon details
	role: "staff",
	selectedOutletId: null,
	outlets: [],
	updateState: (key, val) => {},
};

export const UserDashboardDetailsContext = createContext<stateType>(initialState);

export function UserDashboardDetailsContextWrapper({ children }: { children: React.ReactNode }) {
	// const [state, isLoading, setState] = useFetch("", initialState);
	const [state, setState] = useState<stateType>(initialState);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		AXIOS_INSTANCE.get("/home/initial").then(({ data }) => {
			if (!data.isRegisterComplete) {
				router.push("/onboarding");
				return;
			}
			let selectedOutletId: null | number = null;

			let localStorageId = localStorage.getItem(LOCALSTORAGE_SELECTED_OUTLET_ID);
			if (localStorageId) selectedOutletId = parseInt(localStorageId);
			else if (data.outlets[0]?.id) selectedOutletId = data.outlets[0].id;
			setState({
				...data,
				selectedOutletId,
			});
			setIsLoading(false);
		});
	}, []);

	const updateState = <K extends keyof stateType, V extends stateType[K]>(key: K, value: V) => {
		const updatedState = { ...state };
		updatedState[key] = value;
		setState(updatedState);
	};

	if (isLoading) return <Loader delay={0.3} fullScreen />;

	return (
		<UserDashboardDetailsContext.Provider value={{ ...state, updateState }}>
			{children}
		</UserDashboardDetailsContext.Provider>
	);
}
