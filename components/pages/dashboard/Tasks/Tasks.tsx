import { useSelector } from "react-redux";
import {
	BACKLOG_ID,
	DONE_ID,
	ONGOING_ID,
	TODO_ID,
} from "../../../../constants";
import styles from "./index.module.scss";

interface TasksProps {
	data: any[];
	setData: (val: any[]) => void;
}
export default function Tasks({ data, setData }: TasksProps) {
	const firstName = useSelector((state) => state.auth.firstName);

	const totalTasks =
		data[BACKLOG_ID].length +
		data[TODO_ID].length +
		data[ONGOING_ID].length +
		data[DONE_ID].length;
	return (
		<div>
			<p className="is-3 has-text-weight-medium title">
				Welcome back, <span className="is-capitalized">{firstName}</span>
			</p>

			<p className="has-text-grey-dark">
				You&apos;ve got <strong>{totalTasks} tasks</strong> coming up in the
				next days
			</p>

			<div className={styles.box_wrapper}>
				<div className="columns ">
					<div className="column">
						<div className={`${styles.box} ${styles.success}`}>
							Completed {data[DONE_ID].length}
						</div>
					</div>

					<div className="column">
						<div className={`${styles.box} ${styles.danger}`}>
							Pending {totalTasks - data[DONE_ID].length}
						</div>
					</div>
				</div>
			</div>

			<p>Here are some of your ongoing tasks:</p>
			<div className="pt-5">
				{data[ONGOING_ID].map((item, i) => (
					<div key={i} className={styles.item}>
						<div className="center_vertical">
							<div>
								<p className="has-text-black has-text-weight-medium">
									{item.name}
								</p>
							</div>
						</div>
						<div className={styles.tags}>
							<div className={styles.tag}>Prority : {item.priority}</div>
							<div className={styles.tag}>DUE BY: {item.deadline}</div>
						</div>
					</div>
				))}
				{data[ONGOING_ID].length === 0 && (
					<div className="section has-text-centered has-text-grey">
						<div className="is-size-3">｡^‿^｡</div>
						<br />
						You have no ongoing tasks
					</div>
				)}
			</div>
		</div>
	);
}
