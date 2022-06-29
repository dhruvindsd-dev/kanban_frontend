import React, { ChangeEventHandler, ReactElement } from "react";
import { FieldError } from "react-hook-form";
import { BiErrorCircle } from "react-icons/bi";
import styles from "./index.module.scss";

interface InputProps {
	onBlur?: ChangeEventHandler<HTMLInputElement> | undefined;
	onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
	name?: string;
	error?: FieldError | undefined;
	label: string;
	icon?: ReactElement;
	type?: "text" | "number" | "password" | "email";
	defaultValue?: string;
	value?: string;
	disableTopMargin?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			error,
			label,
			onChange,
			onBlur,
			name,
			icon,
			value = undefined,
			type = "text",
			defaultValue = "",
			disableTopMargin = false,
		},
		ref
	) => {
		return (
			<div>
				<div
					className={`${styles.wrapper} ${disableTopMargin ? "" : "mt-4"} ${
						!!icon ? styles.has_icon : ""
					}`}>
					<input
						ref={ref}
						onChange={onChange}
						onBlur={onBlur}
						name={name}
						type={type}
						placeholder=" "
						defaultValue={defaultValue}
						value={value}
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
				{error && (
					<p className={styles.help}>
						<span>{error.message}</span>
					</p>
				)}
			</div>
		);
	}
);
Input.displayName = Input.name;
export default Input;
