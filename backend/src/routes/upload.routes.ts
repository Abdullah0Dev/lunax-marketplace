// routes/upload.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/image', upload.single('image'), UploadController.uploadImage);
router.post('/images', upload.array('images', 10), UploadController.uploadMultiple);

export default router;