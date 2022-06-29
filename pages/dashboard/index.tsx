import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import Boards from "../../components/pages/dashboard/Boards/Boards";
import Sidebar from "../../components/pages/dashboard/SideBar/Sidebar";
import Tasks from "../../components/pages/dashboard/Tasks/Tasks";
import { AXIOS_INSTANCE, IS_CLIENT } from "../../constants";
import useFetchWithCache from "../../hooks/useFetchWithCache";
import styles from "./index.module.scss";

export default function Dashboard() {
	const router = useRouter();

	const [data, isLoading, setData] = useFetchWithCache<any[]>(
		"/todo/kanban",
		{},
		[]
	);
	useEffect(() => {
		setTimeout(() => {
			AXIOS_INSTANCE.get("/todo/kanban");
		}, 100);
	}, []);

	const token = useSelector((state) => state.auth.token);
	console.log("token", token);

	if (isLoading) return <Loader fullScreen />;

	if (IS_CLIENT && !token) router.push("/login");

	const tab = router.query!.tab;
	if (!tab && IS_CLIENT && router.isReady) router.push("?tab=tasks");
	let view;
	if (tab === "dashboard") view = <Tasks data={data} setData={setData} />;
	else if (tab === "boards") view = <Boards data={data} setData={setData} />;
	else if (router.isReady) view = <Tasks data={data} setData={setData} />;

	// create global redux store
	//

	return (
		<div className={styles.container}>
			<div className={styles.left_col}>
				<Sidebar tab={tab as string} />
			</div>
			<AnimatePresence initial={false} exitBeforeEnter>
				<motion.div
					key={tab as string}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className={styles.right_col}>
					{view}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
