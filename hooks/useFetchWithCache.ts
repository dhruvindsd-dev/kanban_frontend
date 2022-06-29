import { useEffect, useState } from "react";
import { AXIOS_INSTANCE, DASHBOARD_CACHE, IS_CLIENT } from "../constants";

const useFetchWithCache = <T>(
	url: string,
	query = {},
	initialData: T,
	initialLoadState = true //  when you wanna prevent the initial load animation if the context is cached you can use this.
): [T, boolean, (a: T) => void] => {
	const [State, setState] = useState<{
		isLoading: boolean;
		isCached: boolean;
		data: T;
	}>({
		isCached: false,
		isLoading: initialLoadState,
		data: initialData,
	});
	const cachePath = url + JSON.stringify(query);
	//    for updating the data, if you wanna filter the data the use it.
	const setData = (data: any) => {
		DASHBOARD_CACHE.set(cachePath, data);
		setState({
			...State,
			data: data,
		});
	};
	useEffect(() => {
		let updatedState = { ...State };
		updatedState.isLoading = true;
		if (DASHBOARD_CACHE.has(cachePath)) {
			updatedState.isCached = true;
			updatedState.data = DASHBOARD_CACHE.get(cachePath);
		}
		setState(updatedState);

		AXIOS_INSTANCE.get(url, {
			params: query,
			headers: {
				Authorization: IS_CLIENT ? localStorage.getItem("token") : undefined,
			},
		})
			.then((res) => {
				DASHBOARD_CACHE.set(cachePath, res.data);
				setState({
					...State,
					isLoading: false,
					data: res.data,
				});
			})
			.catch((err) => {
				setState({ ...State, isLoading: false });
				console.log("[Error]", err.response);
			});
	}, []);
	return [State.data, State.isLoading, setData];
};

export default useFetchWithCache;

export const getInitialProps = () => {
	return {};
};
