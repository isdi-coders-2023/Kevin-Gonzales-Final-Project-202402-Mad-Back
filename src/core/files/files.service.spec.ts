import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { Logger } from '@nestjs/common';
import { v2 } from 'cloudinary';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService, Logger],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When we use the method uploadImage', () => {
    const uploadStream = (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _op: any,
      cb: (error: Error | null, result: string) => void,
    ) => {
      cb(null, 'result');
      return { end: jest.fn() };
    };

    v2.uploader = {
      upload_stream: jest.fn().mockImplementation(uploadStream),
    } as unknown as typeof v2.uploader;

    it('Then it should upload an image', async () => {
      const file = {} as Express.Multer.File;
      const result = await service.uploadImage('owner', file);
      expect(result).toEqual('result');
    });
  });

  describe('When we use the method uploadImage and it fails', () => {
    it('Then it should throw an error', async () => {
      const uploadStreamError = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _op: any,
        cb: (error: Error | null, result: string) => void,
      ) => {
        cb(new Error('error'), 'result');
        return { end: jest.fn() };
      };

      v2.uploader = {
        upload_stream: jest.fn().mockImplementation(uploadStreamError),
      } as unknown as typeof v2.uploader;

      const file = {} as Express.Multer.File;
      await expect(service.uploadImage('owner', file)).rejects.toThrow('error');
    });
  });
});
