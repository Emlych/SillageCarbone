export type formattedDate = "yyyy-mm-dd" | "dd-mm-yyyy";

/** Format date to specified format (yyyy-mm-dd or dd-mm-yyyy) */
export const formatDate = (
	date: Date,
	stringFormat: formattedDate
): formattedDate | undefined => {
	// Cover cases of unknown string format
	if (stringFormat !== "yyyy-mm-dd" && stringFormat !== "dd-mm-yyyy") {
		console.error("This date format ", stringFormat, "is not taken in charge yet");
		return undefined;
	}

	// Extract day, month and year of date
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();

	// Format data
	let formattedDate = "";
	switch (stringFormat) {
		case "yyyy-mm-dd":
			formattedDate = `${year}-${month}-${day}`;
			break;
		case "dd-mm-yyyy":
			formattedDate = `${day}-${month}-${year}`;
			break;
		default:
			break;
	}

	return formattedDate as formattedDate;
};

/** Format date to specified format (yyyy-mm-dd or dd-mm-yyyy)
 * @params date (string and not Date constructor) to convert
 * @params format of date to convert into
 */
export const formatDateFromString = (
	date: string, //2023-08-06T19:23:37.923Z"
	stringFormat: "dd-mm-yyyy" | "yyyy-mm-dd"
): string | undefined => {
	// -- Cover cases of unknown string format
	if (stringFormat !== "yyyy-mm-dd" && stringFormat !== "dd-mm-yyyy") {
		console.error("This date format ", stringFormat, "is not taken in charge yet");
		return undefined;
	}

	// -- Remove everything after T   ->  //2023-08-06
	const truncateDate = date.substring(0, date.indexOf("T"));

	if (stringFormat === "yyyy-mm-dd") {
		return truncateDate;
	}
	if (stringFormat === "dd-mm-yyyy") {
		const parts = truncateDate.split("-");

		const day = parts[2];
		const month = parts[1];
		const year = parts[0];

		return `${day}-${month}-${year}`;
	}
};

/** Set text to lowercase, replace all accents by equivalent letter without accents and without space */
export const formatTextToString = (text: string): string => {
	// Filter out special characters
	const specialCharacters = [">", "<", "/", "\\"];
	const escapeRegExp = (text: string) => {
		return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	};

	const escapedSpecialCharacters = specialCharacters.map(escapeRegExp);
	const escapedPattern = escapedSpecialCharacters.join("|");
	const regex = new RegExp(escapedPattern, "g");

	const filteredStr = text.replace(regex, "");

	// Pass all to lowercase
	const lowercaseText = filteredStr.toLowerCase();

	// Remove accents
	const withoutAccent = lowercaseText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

	// Transform text into array of words (remove blank spaces and apostroph)  /[ ']/
	const formattedToArrayWithoutBlankSpace = withoutAccent
		.split(/[ ']/)
		.filter((word) => word.length > 0);

	// Remove from array all useless words
	const uselessWordsAndCharacters = ["de", "l", "d'", "le", "la", "a"];
	const formattedToArray = formattedToArrayWithoutBlankSpace.filter((word) => {
		const trimmedWord = word.trim();
		return !uselessWordsAndCharacters.includes(trimmedWord);
	});
	const formattedToString = formattedToArray.join(" ");
	return formattedToString;
};

/** First letter to uppercase */
export const capitalizeFirstLetter = (word: string): string => {
	return word.charAt(0).toUpperCase() + word.slice(1);
};

/** Check if password is strong:
 *  - more than 12 characters
 *  - has lowercase, uppercase, number,
 */
export const isPasswordStrong = (password: string): boolean => {
	const isLongEnough = password.length >= 12;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	return isLongEnough && hasUpperCase && hasLowerCase;
};

/** Is string in email format ? */
export const isEmailFormat = (email: string): boolean => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
};

/**
 * Check if form can be submitted (no empty fields, equal text inputs, correct formats)
 * @param newPassword
 * @param confirmPassword
 * @param mail optionnal
 * @param actualPassword optionnal
 * @returns
 */
export const isFormCorrect = (
	newPassword: string,
	confirmPassword: string,
	mail?: string,
	actualPassword?: string
): { errorMessage: string; isCorrect: boolean } => {
	let errorMessage = "";
	let isCorrect = true;

	if (
		newPassword.length === 0 ||
		confirmPassword.length === 0 ||
		(actualPassword && actualPassword.length === 0)
	) {
		// Fields not empty - Already covered by default html5 behaviour so won't be used normally
		errorMessage = "Veuillez fournir un mot de passe.";
		isCorrect = false;
	}

	if (mail && !isEmailFormat(mail)) {
		// Format mail respected - Already covered by default html5 behaviour so won't be used normally
		errorMessage = "Veuillez fournir une adresse mail valide.";
		isCorrect = false;
	}
	if (!isPasswordStrong(newPassword)) {
		// Weak password
		errorMessage =
			"Le mot de passe est trop faible. Il doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre";
		isCorrect = false;
	}
	if (newPassword !== confirmPassword) {
		// Password and confirm password should be the same
		errorMessage =
			"Le mot de passe à confirmer doit être identique au mot de passe fourni.";
		isCorrect = false;
	}
	return { errorMessage, isCorrect };
};
