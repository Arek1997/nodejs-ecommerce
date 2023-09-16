import multer from 'multer';
import crypto from 'crypto';
import {
	ALLOWED_FILE_EXTENSIONS,
	HTML_FILE_INPUT_NAME_ATTRIBUTE,
	ROOT_FOLDER_NAME,
} from '../utils/multer';

const filesStorage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, ROOT_FOLDER_NAME);
	},

	filename: (_, file, cb) => {
		cb(null, crypto.randomUUID() + '-' + file.originalname);
	},
});

const multerMiddleware = multer({
	storage: filesStorage,
	fileFilter: (_, file, cb) => {
		const fileExtension = file.mimetype.split('/').at(-1);
		cb(null, ALLOWED_FILE_EXTENSIONS.includes(fileExtension!));
	},
}).single(HTML_FILE_INPUT_NAME_ATTRIBUTE);

export default multerMiddleware;
