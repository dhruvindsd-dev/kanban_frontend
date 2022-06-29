import React from "react";
import { Droppable as DroppableDnd, DroppableProps } from "react-beautiful-dnd";
import { FaChevronRight } from "react-icons/fa";
import styles from "./index.module.scss";

interface props {
	top: React.ReactNode;
}

const Droppable = ({ top, children, ...props }: DroppableProps & props) => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<div className="center_vertical">
					<span className="icon mr-2 has-text-grey-light">
						<FaChevronRight />
					</span>
					{top}
				</div>
				<span className="mt-3" />
				<DroppableDnd {...props}>{children}</DroppableDnd>
			</div>
		</div>
	);
};
export default Droppable;
