export class MFile {
  originalname?: string;
  buffer: Buffer | null;
  mimetype?: string;

  constructor(file: Express.Multer.File | MFile) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
    this.mimetype = file?.mimetype;
  }
}
