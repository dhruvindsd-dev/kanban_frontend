import React from "react";
import { BsCardList } from "react-icons/bs";
import { TODO_ID } from "../../../../../constants";
import Droppable from "../../../../DragAndDrop/Droppable/Droppable";
import { menuFuncTypes } from "../Boards";
import Card from "../Card";
import styles from "./index.module.scss";

interface TodoProps {
	data: any;
	customPlaceholder: any;
}

const Todo = ({
	data,
	customPlaceholder,
	handleForward,
	handleBack,
	handleDelete,
	handleEdit,
}: TodoProps & menuFuncTypes) => {
	return (
		<Droppable
			top={
				<>
					<span className="icon mr-2">
						<BsCardList size={30} />
					</span>
					<p className="has-text-weight-semibold">Todo</p>
				</>
			}
			droppableId={TODO_ID}>
			{({ innerRef, droppableProps, placeholder }, { isDraggingOver }) => (
				<div
					className={styles.cards_wrapper}
					ref={innerRef}
					{...droppableProps}>
					{data.length === 0 && (
						<div className={styles.no_items}>
							<div className="is-size-3">＼(^_^ )</div>
							<br />
							No item's found, click the button in the top right to add some
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
							stage={TODO_ID}
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
export default Todo;
