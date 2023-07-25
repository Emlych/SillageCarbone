export enum userType {
	connectedUser,
	admin,
}
export type User = {
	id: number;
	mail: string;
	password: string;
	token: string;
	userType: userType;
	salt: string;
	hash: string;
};
