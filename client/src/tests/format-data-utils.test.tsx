import {
	capitalizeFirstLetter,
	formatDate,
	formatTextToString,
} from "../utils/format-data-utils";

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

	// First letter will be capital letter
	test("First letter will be capital letter", () => {
		const textToFormat = "boîte de thon gros massif";
		const expectedText = "Boîte de thon gros massif";
		const formattedText = capitalizeFirstLetter(textToFormat);
		expect(formattedText).toEqual(expectedText);
	});
});
