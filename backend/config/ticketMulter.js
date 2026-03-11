import multer from 'multer';
import path from 'path';
import os from 'os';
import fs from 'fs';

// Use /tmp on App Engine (read-only filesystem except /tmp)
const uploadsDir = path.join(os.tmpdir(), 'uploads', 'ticket-attachments');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `ticket-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (mimeOk && extOk) return cb(null, true);
    cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed'));
};

const ticketUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
});

export default ticketUpload;
