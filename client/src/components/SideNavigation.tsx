// Navigation on left side
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

type NavigationProps = {
	menuItems: {
		text: string;
		level: number;
		onClick: () => void;
		icon?: FontAwesomeIconProps["icon"];
	}[];
};
const SideNavigation = ({ menuItems }: NavigationProps) => {
	return (
		<nav>
			<ul>
				{menuItems.map((item, index) => (
					<li className={`list-level-${item.level}`} key={index} onClick={item.onClick}>
						{item.icon && <FontAwesomeIcon icon={item.icon} className="icon" />}
						{item.text}
					</li>
				))}
			</ul>
		</nav>
	);
};

export default SideNavigation;
