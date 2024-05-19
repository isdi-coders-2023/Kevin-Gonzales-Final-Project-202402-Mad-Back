import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  Patch,
  Body,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Post,
  Delete,
  ForbiddenException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CryptoService } from '../core/crypto/crypto.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../core/files/files.service';
import { ImgData } from '../types/image.data';
import {
  UpdateUserDto,
  CreateUserDto,
  FilterUserDto,
} from './entities/user.dto';
import { UsersService } from './users.service';
import { LoggedGuard } from '../core/auth/logged.guard';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Get('filter')
  filterCountry(@Body() data: FilterUserDto) {
    return this.usersService.filterUsers(data);
  }

  @UseGuards(LoggedGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const email = data.email || (await this.usersService.findOneUser(id)).email;
    let avatar: ImgData | null = null;

    if (file) {
      const cloudinaryResponse = await this.filesService.uploadImage(
        email,
        file,
      );
      avatar = {
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

    if (data.password) {
      data.password = await this.cryptoService.hash(data.password);
    }

    return this.usersService.updateUser(id, data, avatar);
  }

  @UseGuards(LoggedGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(LoggedGuard)
  @Get('login')
  async loginWithToken(@Body() validData: { payload: { id: string } }) {
    const userId = validData.payload.id;
    const user = await this.usersService.findOneUser(userId);
    if (!user) {
      throw new ForbiddenException('Email and password invalid');
    }

    return {
      token: await this.cryptoService.createToken(user),
    };
  }

  @Post('login')
  async login(@Body() data: CreateUserDto) {
    const { username, email, password } = data;
    if (!password || (!username && !email)) {
      throw new ForbiddenException('Email and password invalid');
    }

    const user = await this.usersService.findForLogin(email, username);

    if (!user) {
      throw new ForbiddenException('Email and password invalid');
    }

    if (!(await this.cryptoService.compare(password, user.password))) {
      throw new ForbiddenException('Email and password invalid');
    }

    return { token: await this.cryptoService.createToken(user) };
  }

  @Post('register')
  async create(@Body() data: CreateUserDto) {
    try {
      data.password = await this.cryptoService.hash(data.password);
      return this.usersService.createUser(data);
    } catch (error) {
      throw new ForbiddenException('Data invalid');
    }
  }
}
