import React from "react";
import { BiError } from "react-icons/bi";
import parseUrls from "../../utils/parseUrls";
import styles from "./index.module.scss";

interface ErrorBoxProps {
	message: string;
	textSize?: string;
	className?: string;
}

const ErrorBox = ({
	message,
	className,
	textSize = "is-size-6",
}: ErrorBoxProps) => {
	return (
		<div className={`${styles.notification} ${className}`}>
			<figure className="icon mr-2">
				<BiError size={24} />
			</figure>

			<p
				className={`${textSize} has-text-weight-medium`}
				dangerouslySetInnerHTML={{
					__html: parseUrls(message, false, "Click here"),
				}}></p>
		</div>
	);
};
export default ErrorBox;
