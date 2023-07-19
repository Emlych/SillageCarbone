// Product defined by an id in db, a name, a company and keywords for search.
export interface PartialProduct {
	_id: number;
	name: string;
	company: string;
}
export interface Product extends PartialProduct {
	keywords: string;
}

export interface DetailedProduct {
	_id: string;
	name: string;
	company: string;
	co2: number;
	type: string;
	description: string;
	imgUrl: string;
	creation_date: Date;
	transportation: string;
	distance: number;
	origin_harbour: string;
	destination_harbour: string;
	intermediate_harbour?: string[];
}

export type DetailedProductType = {
	_id: number;
	name: string;
	company: string;
	co2: number;
	type: string;
	description: string;
	imgUrl: string;
	transportation: string;
	distance: number;
	origin_harbour: string;
	destination_harbour: string;
	intermediate_harbour?: string[];
};
