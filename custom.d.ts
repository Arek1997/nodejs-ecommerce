declare namespace Express {
	export interface Request {
		user: WithId<Document> | null | undefined;
	}
}
