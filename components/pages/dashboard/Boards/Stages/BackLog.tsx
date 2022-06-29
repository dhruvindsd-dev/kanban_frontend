import React from "react";
import { GiFiles } from "react-icons/gi";
import { BACKLOG_ID } from "../../../../../constants";
import Droppable from "../../../../DragAndDrop/Droppable/Droppable";
import { menuFuncTypes } from "../Boards";
import Card from "../Card";
import styles from "./index.module.scss";

interface BackLogProps {
	data: any;
	customPlaceholder: any;
}

const BackLog = ({
	data,
	customPlaceholder,
	handleForward,
	handleBack,
	handleDelete,
	handleEdit,
}: BackLogProps & menuFuncTypes) => {
	return (
		<Droppable
			top={
				<>
					<span className="icon mr-2">
						<GiFiles size={30} />
					</span>
					<p className="has-text-weight-semibold">Backlog</p>
				</>
			}
			droppableId={BACKLOG_ID}>
			{({ innerRef, droppableProps, placeholder }, { isDraggingOver }) => (
				<div
					className={styles.cards_wrapper}
					ref={innerRef}
					{...droppableProps}>
					{data.length === 0 && (
						<div className={styles.no_items}>
							<div className="is-size-3">~(˘▾˘~)</div>
							<br />
							Yaay, you got not backlogs
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
							stage={BACKLOG_ID}
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
export default BackLog;
