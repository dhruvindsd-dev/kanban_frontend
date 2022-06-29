import Link from "next/link";
import React from "react";
import { BsKanban } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import Logo from "../../../Logo/Logo";
import styles from "./index.module.scss";

interface sideBarProps {
	tab: string;
}
export default function Sidebar({ tab }: sideBarProps) {
	return (
		<div className={styles.container}>
			<Logo isDark />
			<div className={styles.mid}>
				<Item
					tab={tab}
					icon={<MdOutlineSpaceDashboard size={28} />}
					text="dashboard"
				/>
				<Item tab={tab} icon={<BsKanban size={28} />} text="boards" />
			</div>
			<div>
				<Item tab={tab} icon={<FiSettings size={28} />} text="settings" />
			</div>
		</div>
	);
}
interface itemProps {
	text: string;
	icon: React.ReactNode;
	tab: string;
}
const Item = ({ text, icon, tab }: itemProps) => (
	<Link href={`?tab=${text}`}>
		<a data-active={tab === text} className={styles.item}>
			{icon}
			<span className="ml-3 is-capitalized">{text}</span>
		</a>
	</Link>
);
