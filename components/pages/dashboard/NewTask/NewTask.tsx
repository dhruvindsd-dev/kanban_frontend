import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TiDelete } from "react-icons/ti";
import { AXIOS_INSTANCE, C_EASE_OUT } from "../../../../constants";
import DateInput from "../../../Form/DateInput/DateInput";
import Input from "../../../Form/Input/Input";
import Loader from "../../../Loader/Loader";
import styles from "./index.module.scss";

interface NewTaskProps {
	handleNewTask: (task: any, shouldClose: boolean, additionalData: any) => void;
	close: () => void;
	data?: any;
	element?: any;
	isEdit?: boolean;
}

interface formValues {
	taskName: string;
	priority: string;
	deadLine: string;
}
const NewTask = ({
	handleNewTask,
	close,
	isEdit,
	data,
	element,
}: NewTaskProps) => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<formValues>();
	const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
		element?.priority ?? "LOW"
	);
	const sendToServer = handleSubmit((formData, event) => {
		console.log("date", formData.deadLine);

		let url = "/todo/new";
		if (isEdit) url = "/todo/edit";
		// return;
		return AXIOS_INSTANCE.post(url, { ...element, ...formData, priority }).then(
			(res) => {
				setValue("taskName", "");
				handleNewTask(
					res.data,
					event!.nativeEvent.submitter.id !== "another",
					data
				);
			}
		);
	});

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ ease: C_EASE_OUT, duration: 0.7 }}
				className={styles.overlay}
				onClick={close}></motion.div>
			<AnimatePresence>{isSubmitting && <Loader isOverlay />}</AnimatePresence>
			<motion.form
				initial={{ x: "100%" }}
				animate={{ x: "0%" }}
				exit={{ x: "100%" }}
				transition={{ ease: C_EASE_OUT, duration: 0.7 }}
				onSubmit={sendToServer}
				className={styles.wrapper}>
				<div onClick={close} className={styles.delete}>
					<TiDelete size={32} />
				</div>
				<p className="is-size-3 has-text-weight-semibold">
					{isEdit ? "Editing Task" : "Add Task"}
				</p>

				<p className="has-text-grey">Tackle your goals in daily doses</p>

				<br />
				<Input
					label="TASKNAME"
					defaultValue={element?.name}
					{...register("taskName", {
						required: "Task Name is Required",
					})}
					error={errors.taskName}
				/>

				<br />
				<DateInput
					defaultValue={element?.deadline}
					value={watch("deadLine")}
					icon={
						<span>
							<img src="/assets/icons/calender.svg" alt="" />
						</span>
					}
					setValue={setValue}
					label="DEADLINE"
					{...register("deadLine", { required: "Deal Line is required" })}
					error={errors.deadLine}
				/>
				<br />
				<p className="is-size-7 has-text-grey mt-4 mb-2 has-text-weight-semibold">
					Priority
				</p>
				<div className="buttons is-size-7 has-text-weight-semibold ">
					<div
						onClick={() => setPriority("LOW")}
						className={`button ${
							priority === "LOW" ? "is-success" : "is-grey"
						}`}>
						Low
					</div>
					<div
						onClick={() => setPriority("MEDIUM")}
						className={`button ${
							priority === "MEDIUM" ? "is-warning" : "is-grey"
						}`}>
						Medium
					</div>
					<div
						onClick={() => setPriority("HIGH")}
						className={`button ${
							priority === "HIGH" ? "is-danger" : "is-grey"
						}`}>
						High
					</div>
				</div>
				<br />
				<div className="buttons   mt-4">
					<button
						id="save"
						type="submit"
						className="button has-text-weight-semibold is-primary">
						{isEdit ? "Update Task" : "Save Task"}
					</button>
					{!isEdit && (
						<button
							id="another"
							type="submit"
							className="button has-text-weight-semibold  is-primary is-light">
							Add Another
						</button>
					)}
				</div>
			</motion.form>
		</>
	);
};
export default NewTask;
