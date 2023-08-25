//! File named dto, but it's just set of interfaces

// Product defined by an id in db, a name, a company and keywords for search.
export interface PartialProduct {
	_id: string;
	name: string;
	company: string;
}
export interface Product extends PartialProduct {
	keywords: string;
}

export interface ProductWithCO2 extends PartialProduct {
	co2: number;
}

export interface DetailedProduct {
	_id: string;
	name: string;
	company: string;
	co2: number;
	productType: { _id: string; name: string };
	description: string;
	imgUrl: string;
	creation_date: Date;
	transportation: { _id: string; name: string };
	distance: number;
	origin_harbour: { _id: string; city: string; country: string };
	destination_harbour: { _id: string; city: string; country: string };
	intermediate_harbour?: string[]; // For v2 implementation
}

export type CarousselProduct = {
	_id: number;
	name: string;
	company: string;
	co2: number;
};
