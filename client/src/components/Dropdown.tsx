/** Dropdown UI component with select content (options) */

import { TransportationType } from "../containers/BackOffice/CreateProduct";
import { UserType } from "./Modal";

export type DropdownProps<T> = {
	options: Map<number | T, T> | null;
	handleSelectInput: Function;
};
const Dropdown = <T extends string | UserType | TransportationType>({
	options,
	handleSelectInput,
}: DropdownProps<T>) => {
	// Hide dropdown if empty or for conditions handled outside of Dropdown component (exemple when press on "esc" or click outside of dropdown)
	if (!options || options.size === 0) return null;

	return (
		<div className="dropdown-menu" data-testid="dropdown">
			{Array.from(options.entries()).map(([key, value]) => (
				<div
					className="dropdown-result"
					key={key}
					onClick={() => handleSelectInput(key)}
					data-testid="dropdown-option"
				>
					{value}
				</div>
			))}
		</div>
	);
};

export default Dropdown;
