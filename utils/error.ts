import { Request } from 'express';

export const isErrorCode = (req: Request) => {
	return (
		req.statusCode?.toString().startsWith('4') ||
		req.statusCode?.toString().startsWith('5')
	);
};
