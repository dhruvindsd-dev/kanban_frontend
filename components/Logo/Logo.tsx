interface props {
	isDark?: boolean;
}
export default function Logo({ isDark = false }: props) {
	return (
		<div>
			<p
				className={`is-size-4 ${
					isDark ? "" : "has-text-white"
				} has-text-weight-bold`}>
				kando
			</p>
		</div>
	);
}
