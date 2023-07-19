import { DetailedProduct } from "./productDto";
import { User, userType } from "./userDto";

export const users: User[] = [
	{
		id: 1,
		mail: "maria@example.com",
		password: "maria123",
		token: "someRandomLongTokenWith1212",
		userType: userType.connectedUser,
		salt: "aghb",
		hash: "oijoj",
	},
	{
		id: 2,
		mail: "juan@example.com",
		password: "juan123",
		token: "jij",
		userType: userType.connectedUser,
		salt: "aghb-1",
		hash: "oijoj-1",
	},
	{
		id: 3,
		mail: "admin@example.com",
		password: "admin",
		token: "djijfl", //to replace with user role table
		userType: userType.admin,
		salt: "aghb-2",
		hash: "oijoj-2",
	},
];

export const mockProducts: DetailedProduct[] = [
	{
		id: 1,
		product_name: "boîte de thon",
		company: "Petit Navire",
		co2: 270,
		product_type: "sea product",
		description: "lorem ipsum",
		imgUrl:
			"https://media.carrefour.fr/medias/da662fc1b2163af092b0cf53a0963c0a/p_540x540/3560070808731-photosite-20200804-174535-0.jpg",
		creation_date: new Date(2019, 9, 4),
		transportation: "porte-conteneur",
		distance: 27030,
		origin_harbour: "Madagascar",
		destination_harbour: "Havre",
		intermediate_harbour: ["Angola", "Barcelone"],
	},
	{
		id: 2,
		product_name: "boîte de gros thon massif",
		company: "Compagnie de Thonitruant",
		co2: 40,
		product_type: "sea product",
		description: "lorem ispuijoiejf",
		imgUrl: "http://",
		creation_date: new Date(2023, 1, 4),
		transportation: "porte-conteneur",
		distance: 20500,
		origin_harbour: "Madagascar",
		destination_harbour: "Havre",
	},
	{
		id: 3,
		product_name: "maquillage à base de poisson",
		company: "Gros Bateau",
		co2: 1000,
		product_type: "cosmetic",
		description: "",
		imgUrl: "http://",
		creation_date: new Date(2023, 5, 13),
		transportation: "porte-conteneur",
		distance: 190,
		origin_harbour: "Eindhoven",
		destination_harbour: "Havre",
	},
];
