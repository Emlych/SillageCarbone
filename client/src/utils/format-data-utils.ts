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
