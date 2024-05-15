import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesService } from 'src/core/files/files.service';
import { ClubsService } from './clubs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImgData } from 'src/types/image.data';
import { UpdateClubDto } from './entities/club.dto';
import { LoggedGuard } from 'src/core/auth/logged.guard';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('clubs')
export class ClubsController {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  findAll() {
    return this.clubsService.getClubs();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.getOneClub(id);
  }

  @UseGuards(LoggedGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateClubDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/' })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const name = data.name || (await this.clubsService.getOneClub(id)).name;
    let logo: ImgData | null = null;

    if (file) {
      const cloudinaryResponse = await this.filesService.uploadImage(
        name,
        file,
      );
      logo = {
        publicId: cloudinaryResponse.public_id,
        folder: cloudinaryResponse.folder,
        fieldName: file.fieldname,
        originalName: file.originalname,
        secureUrl: cloudinaryResponse.secure_url,
        resourceType: cloudinaryResponse.resource_type,
        mimetype: file.mimetype,
        format: cloudinaryResponse.format,
        width: cloudinaryResponse.width,
        height: cloudinaryResponse.height,
        bytes: cloudinaryResponse.bytes,
      };
    }

    return this.clubsService.updateClub(id, data, logo);
  }

  @UseInterceptors(FileInterceptor('logo'))
  @Post('create')
  async create(
    @Body() data: UpdateClubDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/' })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const { name } = data;
    let logo: ImgData | null = null;
    if (file) {
      const cloudinaryResponse = await this.filesService.uploadImage(
        name,
        file,
      );
      logo = {
        publicId: cloudinaryResponse.public_id,
        folder: cloudinaryResponse.folder,
        fieldName: file.fieldname,
        originalName: file.originalname,
        secureUrl: cloudinaryResponse.secure_url,
        resourceType: cloudinaryResponse.resource_type,
        mimetype: file.mimetype,
        format: cloudinaryResponse.format,
        width: cloudinaryResponse.width,
        height: cloudinaryResponse.height,
        bytes: cloudinaryResponse.bytes,
      };
    }

    if (file) {
      const cloudinaryResponse = await this.filesService.uploadImage(
        name,
        file,
      );
      logo = {
        publicId: cloudinaryResponse.public_id,
        folder: cloudinaryResponse.folder,
        fieldName: file.fieldname,
        originalName: file.originalname,
        secureUrl: cloudinaryResponse.secure_url,
        resourceType: cloudinaryResponse.resource_type,
        mimetype: file.mimetype,
        format: cloudinaryResponse.format,
        width: cloudinaryResponse.width,
        height: cloudinaryResponse.height,
        bytes: cloudinaryResponse.bytes,
      };
    }

    return this.clubsService.createClub(data, logo);
  }

  @UseGuards(LoggedGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clubsService.deleteClub(id);
  }
}
