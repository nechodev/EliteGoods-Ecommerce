import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiResponse } from 'cloudinary';
import { File } from 'src/database/entities/file.entity';
import { Product } from 'src/database/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async saveFile(file: Express.Multer.File): Promise<File> {
    const newFile = new File();
    newFile.fieldName = file.originalname;
    newFile.mimeType = file.mimetype;
    newFile.data = file.buffer;
    await this.fileRepository.save(newFile);
    return newFile;
  }

  async updateImage(productID: string, imgData: UploadApiResponse) {
    const product = await this.productRepository.findOne({
      where: { id: productID },
    });

    if (!product)
      throw new NotFoundException('product not found or doesnt exist');
    await this.productRepository.update(
      { id: productID },
      { imgUrl: imgData.secure_url },
    );
    return { productID: productID, message: 'Image URL Update Succesfully!' };
  }
}
