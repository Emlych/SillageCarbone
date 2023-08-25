import { useRef, useState } from "react";
import "./dateinput.css";
import { formatDate } from "../utils/format-data-utils";
import { DEFAULT_FINISH_DATE, DEFAULT_START_DATE } from "../dto/UserDto";

type DateInputProps = {
	value: Date;
	type: "start-date" | "finish-date";
	onChange: (
		event: React.ChangeEvent<HTMLInputElement>,
		type: "name" | "start-date" | "finish-date"
	) => void;
};

/** Custom Input component  */
const DateInput = ({ value, type, onChange }: DateInputProps) => {
	const [isDateSelected, setIsDateSelected] = useState(false);

	// -- Control directly focus without rendering again, better for performance
	const dateRef = useRef<HTMLInputElement>(null);

	return (
		<div className="custom-date">
			<label htmlFor={type}>Date de {type === "start-date" ? "début" : "fin"}:</label>

			<div className="custom-date-input-container">
				<input
					id="custom-date"
					type="date"
					name={type}
					value={value ? formatDate(value, "yyyy-mm-dd") : ""}
					ref={dateRef}
					onChange={(event) => onChange(event, type)}
					// Click on item
					onFocus={() => setIsDateSelected(value !== null)}
					// Item looses focus
					onBlur={() => setIsDateSelected(value !== null)}
					data-testid={type === "start-date" ? "custom-date-start" : "custom-date-finish"}
				/>

				{/* Will overlap actual date input: won't factorise more for lisibility reason */}
				<div className="placeholder-text">
					{isDateSelected && value
						? formatDate(value, "dd-mm-yyyy")
						: formatDate(
								type === "start-date" ? DEFAULT_START_DATE : DEFAULT_FINISH_DATE,
								"dd-mm-yyyy"
						  )}
				</div>
			</div>
		</div>
	);
};

export default DateInput;
