export type Product = {
	id: number;
	name: string;
	company: string;
};
export type DetailedProduct = {
	id: number;
	product_name: string;
	company: string;
	co2: number;
	product_type: string;
	description: string;
	imgUrl: string;
	creation_date: Date;
	transportation: string;
	distance: number;
	origin_harbour: string;
	destination_harbour: string;
	intermediate_harbour?: string[];
};
