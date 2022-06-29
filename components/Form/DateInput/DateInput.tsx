// import { parseISO } from "date-fns";

import { set } from "date-fns";
import format from "date-fns/format";
import { useDayzed } from "dayzed";
import { AnimatePresence, motion } from "framer-motion";
import React, {
	ChangeEventHandler,
	ReactElement,
	useEffect,
	useState,
} from "react";
import ClickAwayListener from "react-click-away-listener";
import {
	FieldError,
	UseFormClearErrors,
	UseFormSetError,
	UseFormSetValue,
} from "react-hook-form";
import { BiErrorCircle } from "react-icons/bi";
import { usePopper } from "react-popper";
import DropDown from "../DropDown/DropDown";
import styles from "./index.module.scss";

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const currentYear = new Date().getFullYear() + 5;
const yearsDropdownMap = Array.from(
	{ length: 70 },
	(_, i): [number, string] => [currentYear - i, currentYear - i + ""]
); // for years dropDown

const weekdayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DateInputProps {
	onBlur?: ChangeEventHandler<HTMLInputElement> | undefined;
	onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
	name: string; // for setValue
	error?: FieldError | undefined;
	label: string;
	icon?: ReactElement;
	type?: "text" | "number" | "password" | "email";
	defaultValue?: string;
	value?: string;
	disableTopMargin?: boolean;
	setValue: UseFormSetValue<any>;
	setError: UseFormSetError<any>;
	clearError: UseFormClearErrors<any>;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
	(
		{
			error,
			label,
			onChange,
			name,
			icon,
			setValue,
			setError,
			clearError,
			value = undefined,
			type = "text",
			defaultValue = "",
			disableTopMargin = false,
		},
		ref
	) => {
		const [hasFocus, setHasFocus] = useState(false);
		const [referenceElement, setReferenceElement] =
			useState<HTMLElement | null>(null);
		const [popperElement, setPopperElement] = useState<HTMLElement | null>(
			null
		);
		const [selectedDate, setSelectedDate] = useState<undefined | Date>(
			defaultValue ? new Date(defaultValue) : new Date()
		);

		const { styles: popperStyles, attributes } = usePopper(
			referenceElement,
			popperElement,
			{
				placement: "top-start",
				strategy: "fixed",
				modifiers: [{ name: "offset", options: { offset: [0, 6] } }],
			}
		);
		useEffect(() => {
			setValue(name, format(selectedDate as Date, "d-M-yyyy"));
		}, [selectedDate]);

		return (
			<div>
				<div
					ref={setReferenceElement}
					className={`${styles.wrapper} ${
						disableTopMargin ? undefined : "mt-4"
					} ${!!icon ? styles.has_icon : undefined}`}>
					<input
						onClick={setHasFocus.bind(this, true)}
						readOnly
						onChange={onChange}
						name={name}
						type={type}
						placeholder=" "
						value={selectedDate ? format(selectedDate, "do MMMM, yyyy ") : ""}
						className={error ? styles.error : ""}
					/>
					<label htmlFor={"test"}>{label}</label>
					{!!icon && <span className={`${styles.icon} icon`}>{icon}</span>}
					{error && (
						<span className={`${styles.error_icon} icon`}>
							<BiErrorCircle size={24} fill="hsl(348, 86%, 61%)" />
						</span>
					)}
				</div>
				<AnimatePresence>
					{hasFocus && (
						<ClickAwayListener onClickAway={setHasFocus.bind(this, false)}>
							<div
								{...attributes.popper}
								style={{ ...popperStyles.popper, zIndex: 100 }}
								ref={setPopperElement}>
								<Datepicker
									prevDateErr={setError.bind(this, name)}
									clearErr={clearError.bind(this, name)}
									close={setHasFocus.bind(this, false)}
									selectedDate={selectedDate}
									setSelectedDate={setSelectedDate}
								/>
							</div>
						</ClickAwayListener>
					)}
				</AnimatePresence>

				{error && (
					<p className={styles.help}>
						<span>{error.message}</span>
					</p>
				)}
			</div>
		);
	}
);
DateInput.displayName = DateInput.name; // for forward ref
export default DateInput;

interface DatepickerProps {
	close: () => void;
	selectedDate: Date | undefined;
	prevDateErr: (val: any) => void;
	clearErr: () => void;
	setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}
function Datepicker({
	selectedDate,
	setSelectedDate,
	close,
	prevDateErr,
	clearErr,
}: DatepickerProps) {
	const [initialDate, setInitialDate] = useState(selectedDate ?? new Date());
	const [offset, setOffset] = useState(0);
	let { calendars, getDateProps } = useDayzed({
		showOutsideDays: true,
		date: initialDate,
		selected: selectedDate,
		onDateSelected: (date, event) => {
			if (date.date < new Date()) {
				prevDateErr({ message: "please select a date in future" });
				close();
				return;
			}
			setSelectedDate(date.date);
			clearErr();
			close();
		},
		offset,
	});

	const handleYearSelect = (year: string) =>
		setInitialDate(set(initialDate, { year: +year }));
	const handleMonthSelect = (month: string) => {
		setInitialDate(set(initialDate, { month: +month }));
		setOffset(0);
	};
	const handleClear = () => {
		setSelectedDate(undefined);
		close();
	};

	if (!calendars.length) return null;
	const calendar = calendars[0];

	return (
		<motion.div
			initial={{ opacity: 0, transformOrigin: "top" }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, transition: { duration: 0.2 } }}
			className={styles.calendar_wrapper}>
			<div className={styles.controls}>
				<p className="has-text-weight-medium buttons  has-addons m-0 ">
					<DropDown
						initialValue={calendar.month.toString()}
						onSelected={handleMonthSelect}
						selected={calendar.month.toString()}
						maxHeight={200}
						items={monthNames.map((value, index) => [value, index.toString()])}>
						{(setReferenceElement, toggle, isOpen) => (
							<div
								ref={setReferenceElement}
								onClick={toggle}
								className="button is-small mb-0">
								<span>{monthNames[calendar.month]}</span>
								<span className="icon">
									<motion.img
										animate={{ rotate: isOpen ? 180 : 0 }}
										src="/assets/icons/arrow-down.svg"
										alt=""
									/>
								</span>
							</div>
						)}
					</DropDown>

					<DropDown
						selected={calendar.year.toString()}
						maxHeight={400}
						onSelected={handleYearSelect}
						items={yearsDropdownMap}>
						{(setReferenceElement, toggle, isOpen) => (
							<div
								ref={setReferenceElement}
								onClick={toggle}
								className="button is-small mb-0">
								<span>{calendar.year}</span>
								<span className="icon">
									<motion.img
										animate={{ rotate: isOpen ? 180 : 0 }}
										src="/assets/icons/arrow-down.svg"
										alt=""
									/>
								</span>
							</div>
						)}
					</DropDown>
				</p>
				<div>
					<div
						className="button is-dark is-inverted is-small"
						onClick={setOffset.bind(this, offset - 1)}>
						<span className="icon is-small">
							<img src="/assets/icons/arrow-left.svg" alt="" />
						</span>
					</div>
					<div
						className="button is-dark is-inverted is-small"
						onClick={setOffset.bind(this, offset + 1)}>
						<span className="icon is-small">
							<img src="/assets/icons/arrow-right.svg" alt="" />
						</span>
					</div>
				</div>
			</div>
			<div className={styles.dates_wrapper}>
				<div className={styles.weekdays}>
					{weekdayNamesShort.map((weekday) => (
						<div
							className={`${styles.date_item} ${styles.is_weekday}`}
							key={weekday}>
							{weekday}
						</div>
					))}
				</div>
				<div>
					{calendar.weeks.map((week, weekIndex) => (
						<div className={styles.weekdays} key={weekIndex}>
							{week.map((dateObj, index) => {
								let key = `${calendar.month}${calendar.year}${weekIndex}${index}`;
								if (!dateObj) {
									return (
										<div
											key={key}
											style={{
												display: "inline-block",
												width: "calc(100% / 7)",
												height: "10px",
												border: "none",
												backgroundColor: "red",
											}}
										/>
									);
								}
								let {
									date,
									selected,
									selectable,
									today,
									nextMonth,
									prevMonth,
								} = dateObj;
								let className;
								if (today) className = styles.today;
								if (selected) className = styles.selected;
								else if (nextMonth || prevMonth)
									className = styles.outside_month;
								if (!selectable) className = "yellow";
								return (
									<div
										className={`${styles.date_item} ${className}`}
										key={key}
										{...getDateProps({ dateObj })}>
										{date.getDate()}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
			<div className="mt-2">
				<a className={styles.calendar_option} onClick={handleClear}>
					Clear
				</a>
				{/* <div className={styles.calendar_option}>
					<div className="icon mr-1">
						<HelpIcon />
					</div>
					<span>Learn More</span>
				</div> */}
			</div>
		</motion.div>
	);
}
