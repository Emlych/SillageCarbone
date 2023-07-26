export enum UserType {
	ConnectedUser = "connectedUser",
	Admin = "admin",
}

export interface User {
	id: number;
	mail: string;
	creation_date: Date;
}
