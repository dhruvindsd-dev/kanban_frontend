import { motion } from "framer-motion";
import React, { MouseEventHandler, useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { usePopper } from "react-popper";
import styles from "./index.module.scss";

interface DropDownProps<T> {
	initialValue?: T;
	selected?: T;
	children: (
		referenceElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
		handleClick: MouseEventHandler,
		isOpen: boolean
	) => React.ReactNode;
	items: [any, T][];
	maxHeight?: number;
	onSelected: (value: T) => void;
	bodyClassName?: string;
	itemClassName?: string;
}

const DropDown = <T extends unknown>({
	children,
	items,
	maxHeight,
	onSelected,
	selected,
	initialValue,
	bodyClassName: className = "",
	itemClassName = "",
}: DropDownProps<T>) => {
	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
	const [selectedValue, setSelectedValue] = useState(initialValue);
	const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
	const { styles: popperStyles, attributes } = usePopper(referenceElement, popperElement, {
		placement: "bottom-start",
		strategy: "absolute",
		modifiers: [{ name: "offset", options: { offset: [0, 6] } }],
	});
	const [isOpen, setIsOpen] = useState(false);
	const handleClick = (value: T) => {
		setSelectedValue(value);
		onSelected(value);
		setIsOpen(false);
	};
	const toggle = () => setIsOpen(!isOpen);
	useEffect(() => {
		if (selected) setSelectedValue(selected);
	}, [selected]);

	return (
		<>
			{children(setReferenceElement, toggle, isOpen)}
			{isOpen && (
				<ClickAwayListener onClickAway={setIsOpen.bind(this, false)}>
					<div {...attributes.popper} style={{ ...popperStyles.popper, zIndex: 10 }} ref={setPopperElement}>
						<div className={styles.wrapper}>
							<motion.div
								initial={{ scale: 0.5, opacity: 0, transformOrigin: "top" }}
								animate={{ scale: 1, opacity: 1 }}
								style={{ maxHeight }}
								className={`${styles.body} ${className}`}>
								{items.map(([item, value]) => (
									<div
										ref={
											selectedValue === value
												? (ref) =>
														ref &&
														ref.scrollIntoView({
															behavior: "auto",
															block: "center",
															inline: "center",
														})
												: null
										}
										onClick={handleClick.bind(this, value)}
										data-selected={selectedValue === value}
										className={`${styles.item} ${itemClassName}`}
										key={`${value}`}>
										{item}
									</div>
								))}
							</motion.div>
						</div>
					</div>
				</ClickAwayListener>
			)}
		</>
	);
};
export default DropDown;
