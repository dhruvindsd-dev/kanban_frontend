export default function createUpdatedStateAfterDragging(data, cardData) {
	if (!cardData.destination) return null;
	const updatedData = { ...data };

	// removing element
	const draggedElement = updatedData[cardData.source.droppableId].splice(
		cardData.source.index,
		1
	)[0];

	// adding element
	updatedData[cardData.destination.droppableId].splice(
		cardData.destination.index,
		0,
		draggedElement
	);

	return { updatedData, draggedElement };
}

// combine: null
// destination: {droppableId: 'done', index: 9}
// draggableId: "LOW71"
// mode: "FLUID"
// reason: "DROP"
// source: {index: 5, droppableId: 'todo'}
// type: "DEFAULT"
