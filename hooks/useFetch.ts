import { useEffect, useState } from "react";
import { AXIOS_INSTANCE } from "../constants";

const useFetch = <T>(url: string, initialData: T, query = {}): [T, boolean, (a: T) => void] => {
	const [State, setState] = useState<{ isLoading: boolean; data: T }>({
		isLoading: true,
		data: initialData,
	});
	//    for updating the data, if you wanna filter the data the use it.
	const setData = (data: T) => {
		setState({
			...State,
			data: data,
		});
	};
	useEffect(() => {
		// setState({ isLoading: true, data: State.data });
		AXIOS_INSTANCE.get(url, {
			params: query,
		})
			.then((res) => {
				setState({
					isLoading: false,
					data: res.data,
				});
			})
			.catch((err) => {
				setState({ isLoading: false, data: initialData });
				console.log("[Error]", err.response);
			});
	}, []);
	return [State.data, State.isLoading, setData];
};

export default useFetch;
