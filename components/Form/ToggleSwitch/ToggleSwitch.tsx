import { motion } from "framer-motion";
import React, { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import Check from "../../../public/icons/check.svg";
import Cross from "../../../public/icons/cross-3.svg";
import styles from "./index.module.scss";

interface ToggleSwitchProps {
	setValue: UseFormSetValue<any>;
}

const ToggleSwitch = React.forwardRef(({}: ToggleSwitchProps, ref) => {
	const [isOn, setIsOn] = useState(false);
	return (
		<div
			onClick={setIsOn.bind(this, !isOn)}
			data-isOn={isOn}
			className={styles.switch}>
			<motion.div
				className={styles.handle}
				layout
				transition={{ type: "spring", stiffness: 700, damping: 30 }}>
				{/* <span className="icon is-small"></span> */}
				{isOn ? <Check /> : <Cross />}
			</motion.div>
		</div>
	);
});

ToggleSwitch.displayName = ToggleSwitch.name; // for forward ref
export default ToggleSwitch;
