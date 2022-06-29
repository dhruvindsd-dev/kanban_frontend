import React from "react";
import Styles from "./index.module.scss";

interface DragPlaceholderProps {
	placeholderProps: any;
}
function DragPlaceholder({ placeholderProps }: DragPlaceholderProps) {
	return (
		<div
			className={Styles.placeholder}
			style={{
				top: placeholderProps.clientY,
				left: placeholderProps.clientX,
				height: placeholderProps.clientHeight,
				width: placeholderProps.clientWidth,
			}}
		/>
	);
}

export default DragPlaceholder;
