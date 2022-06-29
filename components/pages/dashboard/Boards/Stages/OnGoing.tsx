import React from "react";
import { GrInProgress } from "react-icons/gr";
import { ONGOING_ID } from "../../../../../constants";
import Droppable from "../../../../DragAndDrop/Droppable/Droppable";
import { menuFuncTypes } from "../Boards";
import Card from "../Card";
import styles from "./index.module.scss";

interface OnGoingProps {
	data: any;
	customPlaceholder: any;
}

const Ongoing = ({
	data,
	customPlaceholder,
	handleForward,
	handleBack,
	handleDelete,
	handleEdit,
}: OnGoingProps & menuFuncTypes) => {
	return (
		<Droppable
			top={
				<>
					<span className="icon mr-2">
						<GrInProgress size={30} />
					</span>
					<p className="has-text-weight-semibold">Ongoing</p>
				</>
			}
			droppableId={ONGOING_ID}>
			{({ innerRef, droppableProps, placeholder }, { isDraggingOver }) => (
				<div
					className={styles.cards_wrapper}
					ref={innerRef}
					{...droppableProps}>
					{data.length === 0 && (
						<div className={styles.no_items}>
							<div className="is-size-3">｡^‿^｡</div>
							<br />
							You have no ongoing tasks
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
							stage={ONGOING_ID}
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
export default Ongoing;
