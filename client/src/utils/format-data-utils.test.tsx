import {
	capitalizeFirstLetter,
	formatDate,
	formatDateFromString,
	formatTextToString,
	isEmailFormat,
	isFormCorrect,
	isPasswordStrong,
} from "./format-data-utils";

/** Unit testing of utils function */
describe("Format Data Utils Function", () => {
	// Format text to string
	it("Format text to string without accents, extra space and all lowercase", () => {
		const textToFormat = "éàôüñA < Ejiu - de ";
		const expectedFormattedString = "eaouna ejiu -";
		const formattedString = formatTextToString(textToFormat);
		expect(formattedString).toStrictEqual(expectedFormattedString);
	});

	// Format date
	it("Format date with unknown format", () => {
		const date = new Date(2023, 6, 1);
		const formattedDate = formatDate(date, "JJMMAAAA" as any as "yyyy-mm-dd"); //cast to force unknown date format
		expect(formattedDate).toBe(undefined);
	});

	// Format date
	it("Format date to yyyy-mm-dd", () => {
		const date = new Date(2023, 6, 1);
		const formattedDate = formatDate(date, "yyyy-mm-dd");
		expect(formattedDate).toBe("2023-6-1");
	});

	// Format date
	it("Format date to dd-mm-yyyy", () => {
		const date = new Date(2023, 6, 1);
		const formattedDate = formatDate(date, "dd-mm-yyyy");
		expect(formattedDate).toBe("1-6-2023");
	});

	// Format date
	it("Format date with default format", () => {
		const date = new Date(2023, 6, 1);
		const formattedDate = formatDate(date, "JJMMAAAA" as any as "yyyy-mm-dd"); //cast to force unknown date format
		expect(formattedDate).toBe(undefined);
	});

	// Format date to string
	it("Format date to string with format dd-mm-yyyy", () => {
		const dateToFormat = "2023-08-06T19:23:37.923Z";
		const formattedDate = formatDateFromString(dateToFormat, "dd-mm-yyyy");
		expect(formattedDate).toBe("06-08-2023");
	});

	// Format date to string
	it("Format date to string with unknown format", () => {
		const dateToFormat = "2023-08-06T19:23:37.923Z";
		const formattedDate = formatDateFromString(
			dateToFormat,
			"ddmmYYYY" as any as "dd-mm-yyyy" // need to use as any to force format
		);
		expect(formattedDate).toBe(undefined);
	});

	// Format date to string
	it("Format date to string with format yyyy-mm-dd", () => {
		const dateToFormat = "2023-08-06T19:23:37.923Z";
		const formattedDate = formatDateFromString(dateToFormat, "yyyy-mm-dd");
		expect(formattedDate).toBe("2023-08-06");
	});

	// Format string to capital letters
	it("First letter will be capital letter", () => {
		const textToFormat = "boîte de thon gros massif";
		const expectedText = "Boîte de thon gros massif";
		const formattedText = capitalizeFirstLetter(textToFormat);
		expect(formattedText).toEqual(expectedText);
	});

	// Password strength
	it("Password without uppercase, but with lowercase, numbers and long -> weak password", () => {
		const noUppercasePassword = "motdepasse123456789";
		const isStrong = isPasswordStrong(noUppercasePassword);
		expect(isStrong).toEqual(false);
	});

	// Password strength
	it("Password without lowercase, but with uppercase, numbers and long -> weak password", () => {
		const noLowercasePassword = "MOTDEPASSE123456789";
		const isStrong = isPasswordStrong(noLowercasePassword);
		expect(isStrong).toEqual(false);
	});

	// // Password strength
	// it("Password without numbers, but with lowercase and uppercase, and long -> weak password", () => {
	// 	const noNumberPassword = "MOTDEPASSEMOTDEPASSE";
	// 	const isStrong = isPasswordStrong(noNumberPassword);
	// 	expect(isStrong).toEqual(false);
	// });

	// Password strength
	it("Password with numbers, lowercase and uppercase, but short (less than 12) -> weak password", () => {
		const shortPassword = "Mm1";
		const isStrong = isPasswordStrong(shortPassword);
		expect(isStrong).toEqual(false);
	});

	// Password strength
	it("Password with lowercase, uppercase, numbers and long -> strong password", () => {
		const strongPassword = "MOTDEPASSE123456789motdepasse";
		const isStrong = isPasswordStrong(strongPassword);
		expect(isStrong).toEqual(true);
	});

	// Email format
	it("String not respecting the email format (no @)", () => {
		const wrongFormat = "jjo.com";
		const isEmail = isEmailFormat(wrongFormat);
		expect(isEmail).toEqual(false);
	});

	// Email format
	it("String not respecting the email format (no dot)", () => {
		const wrongFormat = "jjo@com";
		const isEmail = isEmailFormat(wrongFormat);
		expect(isEmail).toEqual(false);
	});

	// Email format
	it("String respecting the email format", () => {
		const wrongFormat = "jjo@test.com";
		const isEmail = isEmailFormat(wrongFormat);
		expect(isEmail).toEqual(true);
	});

	// isFormCorrect
	it("Form with missing new password", () => {
		const formStatus = isFormCorrect("", "random");
		const expectedResult = {
			errorMessage: "Veuillez fournir un mot de passe.",
			isCorrect: false,
		};
		expect(formStatus).toEqual(expectedResult);
	});

	// isFormCorrect
	it("Form with missing incorrect mail format", () => {
		const incorrectMail = "nomailformat";
		const formStatus = isFormCorrect(
			"TestPassword",
			"TestPassword",
			incorrectMail,
			undefined
		);
		const expectedResult = {
			errorMessage: "Veuillez fournir une adresse mail valide.",
			isCorrect: false,
		};
		expect(formStatus).toEqual(expectedResult);
	});

	// isFormCorrect
	it("Form with weak password", () => {
		const weakPassword = "MOTDEPASSEMOTDEPASSE";
		const formStatus = isFormCorrect(weakPassword, weakPassword, undefined, undefined);
		const expectedResult = {
			errorMessage:
				"Le mot de passe est trop faible. Il doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre",
			isCorrect: false,
		};
		expect(formStatus).toEqual(expectedResult);
	});

	// isFormCorrect
	it("Form with newPassword different from confirmPassword", () => {
		const strongPassword = "MOTDEPASSE123456789motdepasse";

		const otherStrongPassword = "MOTDEPASSE123456789motdepasse1";
		const formStatus = isFormCorrect(
			otherStrongPassword,
			strongPassword,
			undefined,
			undefined
		);
		const expectedResult = {
			errorMessage:
				"Le mot de passe à confirmer doit être identique au mot de passe fourni.",
			isCorrect: false,
		};
		expect(formStatus).toEqual(expectedResult);
	});

	// isFormCorrect
	it("Correct form", () => {
		const strongPassword = "MOTDEPASSE123456789motdepasse";

		const formStatus = isFormCorrect(
			strongPassword,
			strongPassword,
			undefined,
			undefined
		);
		const expectedResult = {
			errorMessage: "",
			isCorrect: true,
		};
		expect(formStatus).toEqual(expectedResult);
	});
});
