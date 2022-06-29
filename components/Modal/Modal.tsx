import { motion } from "framer-motion";
import React from "react";
import styles from "./index.module.scss";

interface ModalProps {
	children: React.ReactNode;
	close: React.MouseEventHandler;
	isSmall?: boolean;
	disableCross?: boolean;
	width?: string;
	isWhiteCross?: boolean;
}
const Modal = ({
	children,
	close,
	isSmall = false,
	disableCross = false,
	width = "",
}: ModalProps) => {
	return (
		<div className="modal is-active">
			<motion.div
				className="modal-background"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0, transition: { duration: 0.2 } }}
				onClick={close}></motion.div>
			<motion.div
				initial={{ opacity: 0, y: "300px", scale: 0 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{
					opacity: 0,
					scale: 0,
					y: "300px",
					transition: { duration: 0.2 },
				}}
				className="modal-content"
				style={{ width: width ? width : "" }}>
				{!disableCross && (
					<div onClick={close} className={styles.close}>
						<img
							height={26}
							width={26}
							src="/assets/icons/cross-2.svg"
							alt=""
						/>
					</div>
				)}
				<div className={styles.wrapper}>{children}</div>
			</motion.div>
		</div>
	);
};
export default Modal;
