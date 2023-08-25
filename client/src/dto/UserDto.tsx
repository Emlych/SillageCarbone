//! File named dto, but it's just set of interfaces

export enum UserType {
	ConnectedUser = "connectedUser",
	Admin = "admin",
}

export interface User {
	id: number;
	mail: string;
	creation_date: Date;
}

export const DEFAULT_START_DATE = new Date(2010, 9, 5);
export const DEFAULT_FINISH_DATE = new Date();
