import React from "react";
import { IoMdDoneAll } from "react-icons/io";
import { DONE_ID } from "../../../../../constants";
import Droppable from "../../../../DragAndDrop/Droppable/Droppable";
import { menuFuncTypes } from "../Boards";
import Card from "../Card";
import styles from "./index.module.scss";

interface DoneProps {
	data: any;
	customPlaceholder: any;
}

const Done = ({
	data,
	customPlaceholder,
	handleForward,
	handleBack,
	handleDelete,
	handleEdit,
}: DoneProps & menuFuncTypes) => {
	return (
		<Droppable
			top={
				<>
					<span className="icon mr-2">
						<IoMdDoneAll size={30} />
					</span>
					<p className="has-text-weight-semibold">Done</p>
				</>
			}
			droppableId={DONE_ID}>
			{({ innerRef, droppableProps, placeholder }, { isDraggingOver }) => (
				<div
					className={styles.cards_wrapper}
					ref={innerRef}
					{...droppableProps}>
					{data.length === 0 && (
						<div className={styles.no_items}>
							<div className="is-size-3">╮ (. ❛ ᴗ ❛.) ╭</div>
							<br />
							No completed tasks found. <br /> Get some work done
						</div>
					)}
					{data.map((item, i: number) => (
						<Card
							{...{
								...item,
								handleForward,
								handleBack,
								handleDelete,
								handleEdit,
							}}
							stage={DONE_ID}
							index={i}
							id={item.id}
							key={item.id}
						/>
					))}
					{placeholder}
					{isDraggingOver && customPlaceholder}
				</div>
			)}
		</Droppable>
	);
};
export default Done;
