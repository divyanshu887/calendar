import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  private events: Event[] = [];

  create(createEventDto: CreateEventDto, file?: Express.Multer.File): Event {
    const now = new Date();
    const startTime = new Date(createEventDto.startTime);

    if (startTime < now) {
      throw new BadRequestException('Event start time must be in the future');
    }

    const event = {
      id: uuidv4(),
      ...createEventDto,
      media: file ?? undefined,
      createdOn: now,
    };

    this.events.push(event);
    return event;
  }

  updateEventById(
    id: string,
    updateEventDto: UpdateEventDto,
    file?: Express.Multer.File,
  ): Event {
    const eventIndex = this.events.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const existingEvent = this.events[eventIndex];

    const updatedStartTime = updateEventDto.startTime
      ? new Date(updateEventDto.startTime)
      : null;

    if (updatedStartTime && updatedStartTime < new Date()) {
      throw new BadRequestException('Cannot update event to a past start time');
    }

    const updatedEvent: Event = {
      ...existingEvent,
      ...updateEventDto,
      media: file ?? existingEvent.media,
    };

    this.events[eventIndex] = updatedEvent;
    return updatedEvent;
  }

  findAll(): Event[] {
    return this.events;
  }

  findEventById(id: string): Event {
    const result = this.events.find((event) => event.id === id);

    if (!result) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return result;
  }

  findEventByDate(date: string): Event[] {
    if (!date) {
      throw new BadRequestException('Date parameter is required');
    }

    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const targetDate = eventDate.toLocaleDateString('en-CA');

    const events = this.events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.toLocaleDateString('en-CA') === targetDate;
    });

    if (events.length === 0) {
      throw new NotFoundException(`No events found for the date: ${date}`);
    }

    return events;
  }

  deleteEventById(id: string): boolean {
    const index = this.events.findIndex((event) => event.id === id);

    if (index === -1) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    this.events.splice(index, 1);
    return true;
  }
}
