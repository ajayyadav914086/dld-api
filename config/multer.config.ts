import multer from 'multer';
var path = require('path');

const storageEngine = multer.diskStorage({
    destination: './public/uploads',
    filename: (req: any, file: any, fn: any) => {
        fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname));
    }
})

const storageEngineExcel = multer.diskStorage({
    destination: './public/excel',
    filename: (req: any, file: any, fn: any) => {
        fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 5000000 },
    fileFilter: (req: any, file: any, cb: any) => {
        validateFile(file, cb);
    }
}).single('image');

export const uploadExcel = multer({
    storage: storageEngineExcel,
    limits: { fileSize: 5000000 },
    fileFilter: (req: any, file: any, cb: any) => {
        validateFileExcel(file, cb);
    }
}).single('excel');

var validateFile = (file: any, cb: any) => {
    var allowedFileTypes = /jpeg|jpg|png|gif|pdf/;
    const extension = allowedFileTypes.test(path.extname(file.originalname));
    if (extension) {
        return cb(null, true);
    } else {
        cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.");
    }
}

var validateFileExcel = (file: any, cb: any) => {
    var allowedFileTypes = /xlsx/;
    const extension = allowedFileTypes.test(path.extname(file.originalname));
    if (extension) {
        return cb(null, true);
    } else {
        cb("Invalid file type. Only XLSX file are allowed.");
    }
}

export default upload;