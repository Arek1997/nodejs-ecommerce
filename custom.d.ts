declare namespace Express {
	export interface Request {
		user: WithId<Document> | null | undefined;
	}
}

declare global {
	declare module 'express-session' {
		interface SessionData {
			isLoggedIn: boolean;
			user: any;
		}
	}
}
