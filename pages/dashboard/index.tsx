import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import Sidebar from "../../components/pages/dashboard/SideBar/Sidebar";
import { IS_CLIENT } from "../../constants";
import useFetchWithCache from "../../hooks/useFetchWithCache";
import styles from "./index.module.scss";

const LazyTasks = dynamic(
	() => import("../../components/pages/dashboard/Tasks/Tasks"),
	{ loading: () => <Loader /> }
);

const LazyBoards = dynamic(
	() => import("../../components/pages/dashboard/Boards/Boards"),
	{ loading: () => <Loader className="" /> }
);

export default function Dashboard() {
	const router = useRouter();
	const [data, isLoading, setData] = useFetchWithCache<any[]>(
		"/todo/kanban",
		{},
		[]
	);
	const token = useSelector((state) => state.auth.token);

	if (IS_CLIENT && !token) router.push("/login");

	const tab = router.query!.tab;
	if (!tab && IS_CLIENT && router.isReady) router.push("?tab=tasks");

	let view;
	if (tab === "dashboard") view = <LazyTasks data={data} setData={setData} />;
	else if (tab === "boards")
		view = <LazyBoards data={data} setData={setData} />;
	else if (router.isReady) view = null;

	//

	if (isLoading) return <Loader fullScreen />;
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
