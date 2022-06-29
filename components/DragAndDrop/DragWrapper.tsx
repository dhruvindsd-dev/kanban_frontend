import React, { useState } from "react";
import {
	DragDropContext,
	DragStart,
	DragUpdate,
	DropResult,
} from "react-beautiful-dnd";
import DragPlaceholder from "./DragPlaceHolder";

const insertItem = (arr: any[], item: any, index: number) => [
	...arr.slice(0, index),
	item,
	...arr.slice(index),
];

const removeItem = (arr: any[], index: number) => [
	...arr.slice(0, index),
	...arr.slice(index + 1),
];

const swapElements = (arr: any[], source: number, destination: number) =>
	insertItem(removeItem(arr, source), arr[source], destination);

interface MainDragWrapperProps {
	children: (val: React.ReactNode) => React.ReactNode;
	handleDragEnd: (val: DropResult) => void;
	handleDragStart?: (val: DragStart) => void;
	handleDragUpdate?: (val: DragUpdate) => void;
}

function MainDragWrapper({
	handleDragEnd,
	children,
	handleDragStart = (v) => {},
	handleDragUpdate = (v) => {},
}: MainDragWrapperProps) {
	const [PlaceholderProps, setPlaceholderProps] = useState({});

	const setPlaceholder = (update: DragUpdate) => {
		if (!update.destination) return;
		const { source, destination } = update;

		const draggable = document.querySelector(
			`[data-rbd-drag-handle-draggable-id=${update.draggableId}]`
		);
		const droppable = document.querySelector(
			`[data-rbd-droppable-id=${destination.droppableId}]`
		);

		if (!draggable || !droppable) return;

		const { clientHeight, clientWidth } = draggable;

		const reorderedChildren =
			source.droppableId === destination.droppableId
				? swapElements([...droppable.children], source.index, destination.index)
				: insertItem([...droppable.children], draggable, destination.index);

		const clientY =
			parseFloat(window.getComputedStyle(droppable).paddingTop) +
			[...reorderedChildren]
				.slice(0, destination.index)
				.reduce((total, curr) => {
					const style = curr.currentStyle || window.getComputedStyle(curr);
					const marginBottom = parseFloat(style.marginBottom);

					return total + curr.clientHeight + marginBottom;
				}, 0);

		setPlaceholderProps({
			destinationId: destination.droppableId,
			clientHeight,
			clientWidth,
			clientY,
			clientX: parseFloat(window.getComputedStyle(droppable).paddingLeft),
		});
	};

	const handleStart = (data: DragStart) => {
		handleDragStart(data);
		setPlaceholder({
			...data,
			destination: data.source,
		});
	};

	const handleUpdate = (data: DragUpdate) => {
		handleDragUpdate(data);
		setPlaceholder(data);
	};

	return (
		<DragDropContext
			onDragStart={handleStart}
			onDragEnd={handleDragEnd}
			onDragUpdate={handleUpdate}>
			{children(
				!!Object.keys(PlaceholderProps).length ? (
					<DragPlaceholder placeholderProps={PlaceholderProps} />
				) : null
			)}
		</DragDropContext>
	);
}

export default MainDragWrapper;
