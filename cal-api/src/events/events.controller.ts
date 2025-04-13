import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /(image\/(jpeg|png|gif)|video\/(mp4|mkv|avi))/i,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ): Event {
    return this.eventsService.create(createEventDto, file);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /(image\/(jpeg|png|gif)|video\/(mp4|mkv|avi))/i,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ): Event {
    return this.eventsService.updateEventById(id, updateEventDto, file);
  }

  @Get()
  findAll(): Event[] {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findEventById(@Param('id') id: string): Event {
    return this.eventsService.findEventById(id);
  }

  @Get('/date/:date')
  findEventByDate(@Param('date') date: string): Event[] {
    return this.eventsService.findEventByDate(date);
  }

  @Delete(':id')
  deleteEventById(@Param('id') id: string): boolean {
    return this.eventsService.deleteEventById(id);
  }
}
