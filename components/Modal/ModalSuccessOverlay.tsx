import { motion } from "framer-motion";
import React from "react";
import Button from "../Button/Button";
import styles from "./index.module.scss";

interface ModalSuccessOverlayProps {
	children: React.ReactNode;
	close: () => void;
}

const ModalSuccessOverlay = ({ children, close }: ModalSuccessOverlayProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className={styles.success_overlay}>
			<figure className="image is-96x96">
				<img src="/icons/success-check.svg" alt="" />
			</figure>
			<div className="is-size-5 has-text-weight-medium mt-6 mb-4">
				{children}
			</div>

			<Button onClick={close} className="is-light">
				Close
			</Button>
		</motion.div>
	);
};
export default ModalSuccessOverlay;
