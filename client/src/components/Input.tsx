import "./input.css";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

type InputProps = {
	faIcon: FontAwesomeIconProps["icon"];
	placeholderText: string;
	"data-testid": string;
	onChange: (
		event: React.ChangeEvent<HTMLInputElement>,
		type?: "name" | "start-date" | "finish-date"
	) => void;
	value?: string | number;
	type?: "text" | "password" | "number" | "email";
};

/** Custom Input component  */
const Input = ({
	faIcon,
	placeholderText,
	value,
	"data-testid": dataTestId,
	onChange,
	type,
}: InputProps) => {
	return (
		<div className="custom-input">
			<label>
				<FontAwesomeIcon icon={faIcon} />
			</label>

			<input
				placeholder={placeholderText}
				value={value}
				data-testid={dataTestId}
				onChange={onChange}
				type={type}
				required
			/>
		</div>
	);
};

export default Input;
