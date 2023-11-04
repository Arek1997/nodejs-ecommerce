import { ALLOWED_FILE_EXTENSIONS } from './multer';

export const inputFileAcceptedFiles = ALLOWED_FILE_EXTENSIONS.map(
	(element) => `image/${element}`
).join(', ');

export const ITEMS_PER_PAGE = 2;
