import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ClickAwayListener from "react-click-away-listener";
import { BsThreeDots } from "react-icons/bs";
import { BACKLOG_ID, DONE_ID } from "../../../../constants";
import { menuFuncTypes } from "./Boards";
import styles from "./index.module.scss";

interface CardProps {
	id: string;
	index: number;
	deadline: string;
	name: "string";
	priority: string;
	stage: string;
}

const Card = ({
	id,
	index,
	deadline,
	name,
	priority,
	stage,
	handleForward,
	handleBack,
	handleDelete,
	handleEdit,
}: CardProps & menuFuncTypes) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const handleClick = (func) => {
		setIsMenuOpen(false);
		func(index, stage);
	};
	return (
		<Draggable draggableId={priority + id} index={index}>
			{(provided, { isDragging }) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={styles.card_container}>
					<AnimatePresence>
						{isMenuOpen && (
							<ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
								<motion.div
									initial={{
										opacity: 0,
										x: "10%",
										scale: 0.5,
										transformOrigin: "top left",
									}}
									animate={{
										opacity: 1,
										scale: 1,
										transformOrigin: "top left",
									}}
									exit={{ opacity: 0, scale: 0.5, transformOrigin: "top left" }}
									className={styles.menu}>
									{stage !== BACKLOG_ID && (
										<p
											onClick={() => handleClick(handleBack)}
											className={styles.item}>
											Back
										</p>
									)}
									{stage !== DONE_ID && (
										<p
											onClick={() => handleClick(handleForward)}
											className={styles.item}>
											Forward
										</p>
									)}
									<p
										onClick={() => handleClick(handleEdit)}
										className={styles.item}>
										Edit
									</p>
									<p
										onClick={() => handleClick(handleDelete)}
										className={styles.item}>
										Delete
									</p>
								</motion.div>
							</ClickAwayListener>
						)}
					</AnimatePresence>

					<motion.div
						animate={{ opacity: isDragging ? 0.7 : 1 }}
						transition={{ duration: 0.1 }}
						className={`${styles.card} ${styles[priority]}`}>
						<div
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className={styles.menu_icon}>
							<BsThreeDots />
						</div>
						<p>{name}</p>
						<div className={styles.deadline}>{deadline}</div>
					</motion.div>
				</div>
			)}
		</Draggable>
	);
};
export default Card;
