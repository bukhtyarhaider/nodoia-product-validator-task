import { Router } from "express";
import { upload } from "./file-upload.middleware";
import { UploadController } from "./upload.controller";

const router = Router();

router.post("/upload", upload.single("file"), UploadController.uploadProducts);

router.get("/products", UploadController.getProducts);

export default router;
