import { MouseEventHandler } from "react";
import "./button.css";

type ButtonProps = {
	buttonText: string;
	buttonType: "button" | "submit" | "reset";
	callback?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	alert?: boolean;
};

/** Custom button component  */
const Button = ({ buttonText, buttonType, callback, disabled, alert }: ButtonProps) => {
	return (
		<button
			type={buttonType}
			data-testid="submit"
			className={alert ? "button red" : "button"}
			onClick={callback ?? undefined}
			disabled={disabled ?? undefined}
		>
			{buttonText}
		</button>
	);
};

export default Button;
