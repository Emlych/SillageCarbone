export enum UserType {
	ConnectedUser = "connectedUser",
	Admin = "admin",
}

export type User = {
	id: number;
	mail: string;
	password: string;
	token: string;
	userType: UserType;
};
