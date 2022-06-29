import React from "react";

interface CheckboxProps {
	className?: string;
	label: string;
	isCheckRadio?: boolean;
	name?: string;
	value?: string;
	isChecked?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ isChecked, className = "is-black", name, label, value, isCheckRadio = false }, ref) => {
		return (
			<>
				<input
					readOnly
					ref={ref}
					className={`is-checkradio has-background-color ${className}`}
					id={name}
					type={isCheckRadio ? "radio" : "checkbox"}
					name={name}
					checked={isChecked}
				/>
				<label htmlFor={name}>{label}</label>
			</>
		);
	}
);
Checkbox.displayName = Checkbox.name;
export default Checkbox;
