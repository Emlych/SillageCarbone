import {
	capitalizeFirstLetter,
	formatDate,
	formatTextToString,
	isEmailFormat,
	isPasswordStrong,
} from "./format-data-utils";

/** Unit testing of utils function */
describe("Format Data Utils Function", () => {
	// Format text to string
	test("Format text to string without accents, extra space and all lowercase", () => {
		const textToFormat = "éàôüñA < Ejiu - de ";
		const expectedFormattedString = "eaouna ejiu -";
		const formattedString = formatTextToString(textToFormat);
		expect(formattedString).toStrictEqual(expectedFormattedString);
	});

	// Format date
	test("Format date to yyyy-mm-dd", () => {
		const date = new Date(2023, 6, 1);
		const formattedDate = formatDate(date, "yyyy-mm-dd");
		expect(formattedDate).toBe("2023-6-1");
	});

	// Format date
	test("Format date to dd-mm-yyyy", () => {
		const date = new Date(2023, 6, 1);
		const formattedDate = formatDate(date, "dd-mm-yyyy");
		expect(formattedDate).toBe("1-6-2023");
	});

	// Format string to capital letters
	test("First letter will be capital letter", () => {
		const textToFormat = "boîte de thon gros massif";
		const expectedText = "Boîte de thon gros massif";
		const formattedText = capitalizeFirstLetter(textToFormat);
		expect(formattedText).toEqual(expectedText);
	});

	// Password strength
	test("Password without uppercase, but with lowercase, numbers and long -> weak password", () => {
		const noUppercasePassword = "motdepasse123456789";
		const isStrong = isPasswordStrong(noUppercasePassword);
		expect(isStrong).toEqual(false);
	});

	// Password strength
	test("Password without lowercase, but with uppercase, numbers and long -> weak password", () => {
		const noLowercasePassword = "MOTDEPASSE123456789";
		const isStrong = isPasswordStrong(noLowercasePassword);
		expect(isStrong).toEqual(false);
	});

	// Password strength
	test("Password without numbers, but with lowercase and uppercase, and long -> weak password", () => {
		const noNumberPassword = "MOTDEPASSEMOTDEPASSE";
		const isStrong = isPasswordStrong(noNumberPassword);
		expect(isStrong).toEqual(false);
	});

	// Password strength
	test("Password with numbers, lowercase and uppercase, but short (less than 12) -> weak password", () => {
		const shortPassword = "Mm1";
		const isStrong = isPasswordStrong(shortPassword);
		expect(isStrong).toEqual(false);
	});

	// Password strength
	test("Password with lowercase, uppercase, numbers and long -> strong password", () => {
		const strongPassword = "MOTDEPASSE123456789motdepasse";
		const isStrong = isPasswordStrong(strongPassword);
		expect(isStrong).toEqual(true);
	});

	// Email format
	test("String not respecting the email format (no @)", () => {
		const wrongFormat = "jjo.com";
		const isEmail = isEmailFormat(wrongFormat);
		expect(isEmail).toEqual(false);
	});

	// Email format
	test("String not respecting the email format (no dot)", () => {
		const wrongFormat = "jjo@com";
		const isEmail = isEmailFormat(wrongFormat);
		expect(isEmail).toEqual(false);
	});

	// Email format
	test("String respecting the email format", () => {
		const wrongFormat = "jjo@test.com";
		const isEmail = isEmailFormat(wrongFormat);
		expect(isEmail).toEqual(true);
	});
});
