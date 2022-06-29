import { motion } from "framer-motion";
import React from "react";
import styles from "./index.module.scss";

interface LoaderProps {
	className?: string;
	fullScreen?: boolean;
	delay?: number;
	isOverlay?: boolean;
}

const Loader = ({
	fullScreen,
	delay = 0,
	className = "",
	isOverlay = false,
}: LoaderProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3, delay }}
			className={`${!!fullScreen ? styles.wrapper : undefined} ${
				isOverlay ? styles.overlay : ""
			}`}>
			<div className={`${className}  ${styles.loader} `}></div>
		</motion.div>
	);
};
export default Loader;
