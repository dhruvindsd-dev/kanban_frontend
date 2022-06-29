import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Droppable as DroppableDnd, DropResult } from "react-beautiful-dnd";
import { FaPlus } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import {
	AXIOS_INSTANCE,
	BACKLOG_ID,
	DONE_ID,
	ONGOING_ID,
	TODO_ID,
} from "../../../../constants";
import MainDragWrapper from "../../../DragAndDrop/DragWrapper";
import Modal from "../../../Modal/Modal";
import NewTask from "../NewTask/NewTask";
import styles from "./index.module.scss";
import BackLog from "./Stages/BackLog";
import Done from "./Stages/Done";
import Ongoing from "./Stages/OnGoing";
import Todo from "./Stages/Todo";

export interface menuFuncTypes {
	handleForward: (index: number, stage: string) => void;
	handleBack: (index: number, stage: string) => void;
	handleDelete: (index: number, stage: string) => void;
	handleEdit: (index: number, stage: string) => void;
}

interface BoardsProps {
	data: any[];
	setData: (val: any[]) => void;
}
export default function Boards({ data, setData }: BoardsProps) {
	const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
		isOpen: boolean;
		data?: any;
		taskName?: string;
	}>({
		isOpen: false,
	});
	const [newTaskModal, setNewTaskModal] = useState<{
		isOpen: boolean;
		data?: any;
		element?: any;
		isEdit?: boolean;
	}>({ isOpen: false });
	const [shouldShowDelete, setShouldShowDelete] = useState(false);

	const handleDragEnd = (dragData: DropResult) => {
		setShouldShowDelete(false);
		if (!dragData.destination?.droppableId) return;

		const updatedData = { ...data };
		if (dragData.destination.droppableId === "delete") {
			setConfirmDeleteModal({
				isOpen: true,
				data: {
					index: dragData.source.index,
					source: dragData.source.droppableId,
				},
				taskName:
					updatedData[dragData.source.droppableId][dragData.source.index].name,
			});
			return;
		}

		const element = updatedData[dragData.source.droppableId].splice(
			dragData.source.index,
			1
		)[0];

		updatedData[dragData.destination.droppableId].splice(
			dragData.destination.index,
			0,
			element
		)[0];

		setData(updatedData);
		AXIOS_INSTANCE.post("/todo/kanban/move", {
			id: element.id,
			to: dragData.destination.droppableId,
		});

		// updatedData[];
	};

	const handleForward = (index, currentStage) => {
		// remove from current stage and push forward
		let nextStage;
		const updatedData = { ...data };

		const element = updatedData[currentStage].splice(index, 1)[0];

		if (currentStage === BACKLOG_ID) nextStage = TODO_ID;
		else if (currentStage === TODO_ID) nextStage = ONGOING_ID;
		if (currentStage === ONGOING_ID) nextStage = DONE_ID;

		updatedData[nextStage].splice(0, 0, element);
		setData(updatedData);
		AXIOS_INSTANCE.post("/todo/kanban/move", { id: element.id, to: nextStage });
	};

	const handleBack = (index, currentStage) => {
		let nextStage;
		const updatedData = { ...data };
		const element = updatedData[currentStage].splice(index, 1)[0];

		if (currentStage === TODO_ID) nextStage = BACKLOG_ID;
		else if (currentStage === ONGOING_ID) nextStage = TODO_ID;
		else if (currentStage === DONE_ID) nextStage = ONGOING_ID;

		updatedData[nextStage].splice(0, 0, element);
		setData(updatedData);
		AXIOS_INSTANCE.post("/todo/kanban/move", { id: element.id, to: nextStage });
	};

	const handleDelete = (index, currentStage) => {
		const updatedData = { ...data };
		const element = updatedData[currentStage].splice(index, 1)[0];
		setData(updatedData);

		AXIOS_INSTANCE.post("/todo/kanban/delete", { id: element.id });
	};
	const handleEdit = (index, currentStage) => {
		const updatedData = { ...data };
		const element = updatedData[currentStage][index];
		setNewTaskModal({
			isOpen: true,
			data: {
				currentStage,
				index,
			},
			element,
			isEdit: true,
		});
	};

	const commonColumnProps = {
		handleForward,
		handleBack,
		handleDelete,
		handleEdit,
	};

	const handleNewTask = (newElement, shouldClose = true, additionalData) => {
		const updatedData = { ...data };
		if (newTaskModal.isEdit) {
			// get element
			updatedData[additionalData.currentStage][additionalData.index] =
				newElement;
		} else updatedData[BACKLOG_ID].unshift(newElement);
		setData(updatedData);
		if (shouldClose) setNewTaskModal({ isOpen: false });
	};
	const handleConfirmDelete = () => {
		// handleDelete(dragData.source.index, dragData.source.droppableId);
		handleDelete(confirmDeleteModal.data.index, confirmDeleteModal.data.source);
		setConfirmDeleteModal({ isOpen: false });
	};
	return (
		<>
			<AnimatePresence>
				{confirmDeleteModal.isOpen && (
					<Modal close={() => setConfirmDeleteModal({ isOpen: false })}>
						<div className="has-text-centered">
							<p className="is-size-5 has-text-weight-medium">
								Are you confirm you want to delete task : <br />
								<strong>{confirmDeleteModal.taskName}</strong>
							</p>
							<div className="buttons is-centered pt-6">
								<button
									className="button is-primary is-inverted"
									close={() => setConfirmDeleteModal({ isOpen: false })}>
									Cancel
								</button>
								<button
									className="button is-primary"
									onClick={handleConfirmDelete}>
									Confirm
								</button>
							</div>
						</div>
					</Modal>
				)}
			</AnimatePresence>
			<div className={styles.add_task}>
				<button
					onClick={() => setNewTaskModal({ isOpen: true })}
					className="button is-primary has-text-weight-bold">
					<span className="icon">
						<FaPlus />
					</span>
					<span>Add Task</span>
				</button>
				<AnimatePresence>
					{newTaskModal.isOpen && (
						<NewTask
							{...newTaskModal}
							close={() => setNewTaskModal({ isOpen: false })}
							handleNewTask={handleNewTask}
						/>
					)}
				</AnimatePresence>
			</div>
			<MainDragWrapper
				handleDragStart={() => setShouldShowDelete(true)}
				handleDragEnd={handleDragEnd}>
				{(customPlaceholder) => (
					<div className={styles.container}>
						<motion.div
							animate={{ opacity: shouldShowDelete ? 1 : 0 }}
							className={styles.delete_hover}>
							<DroppableDnd droppableId="delete">
								{(
									{ innerRef, droppableProps, placeholder },
									{ isDraggingOver }
								) => (
									<motion.div
										animate={{ rotate: isDraggingOver ? 30 : 0 }}
										ref={innerRef}
										{...droppableProps}>
										<ImBin size={32} />
									</motion.div>
								)}
							</DroppableDnd>
						</motion.div>
						<BackLog
							customPlaceholder={customPlaceholder}
							data={data[BACKLOG_ID]}
							{...commonColumnProps}
						/>
						<Todo
							customPlaceholder={customPlaceholder}
							data={data[TODO_ID]}
							{...commonColumnProps}
						/>
						<Ongoing
							customPlaceholder={customPlaceholder}
							data={data[ONGOING_ID]}
							{...commonColumnProps}
						/>
						<Done
							customPlaceholder={customPlaceholder}
							data={data[DONE_ID]}
							{...commonColumnProps}
						/>
					</div>
				)}
			</MainDragWrapper>
		</>
	);
}
