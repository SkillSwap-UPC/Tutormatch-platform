
import { Injectable, NotFoundException } from '@nestjs/common';
import { TutoringSessionRepository } from '../../domain/repositories/tutoring-session.repository.interface';
import { TutoringSession } from '../../domain/models/tutoring-session.model';
import { TutoringMaterial } from '../../domain/models/tutoring-material.model';
import { TutoringReview } from '../../domain/models/tutoring-review.model';
import { TutoringAvailableTime } from '../../domain/models/tutoring-available-time.model';
import { CreateTutoringSessionDto } from '../dtos/create-tutoring-session.dto';
import { CreateTutoringMaterialDto } from '../dtos/create-tutoring-material.dto';
import { CreateTutoringReviewDto } from '../dtos/create-tutoring-review.dto';
import { CreateAvailableTimeDto } from '../dtos/create-available-time.dto';

@Injectable()
export class TutoringSessionService {
  constructor(
    private readonly tutoringSessionRepository: TutoringSessionRepository
  ) {}

  async findAll(): Promise<TutoringSession[]> {
    return this.tutoringSessionRepository.findAll();
  }

  async findById(id: string): Promise<TutoringSession> {
    const session = await this.tutoringSessionRepository.findById(id);
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID "${id}" not found`);
    }
    return session;
  }

  async findByTutorId(tutorId: string): Promise<TutoringSession[]> {
    return this.tutoringSessionRepository.findByTutorId(tutorId);
  }

  async findByCourseId(courseId: string): Promise<TutoringSession[]> {
    return this.tutoringSessionRepository.findByCourseId(courseId);
  }

  async create(createSessionDto: CreateTutoringSessionDto): Promise<TutoringSession> {
    const {
      tutorId,
      courseId,
      title,
      description,
      price,
      whatTheyWillLearn,
      imageUrl,
      availableTimes,
    } = createSessionDto;

    const session = new TutoringSession({
      id: '',
      tutorId,
      courseId,
      title,
      description,
      price,
      whatTheyWillLearn,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdSession = await this.tutoringSessionRepository.create(session);

    // Add available times if provided
    if (availableTimes && availableTimes.length > 0) {
      for (const timeDto of availableTimes) {
        await this.addAvailableTime(createdSession.id, timeDto);
      }
    }

    const retrievedSession = await this.tutoringSessionRepository.findById(createdSession.id);
    if (!retrievedSession) {
      throw new NotFoundException(`Created tutoring session with ID "${createdSession.id}" not found`);
    }
    return retrievedSession;
  }

  async update(id: string, updateData: Partial<TutoringSession>): Promise<TutoringSession> {
    const existingSession = await this.tutoringSessionRepository.findById(id);

    if (!existingSession) {
      throw new NotFoundException(`Tutoring session with ID "${id}" not found`);
    }

    const updatedSession = await this.tutoringSessionRepository.update(id, {
      ...updateData,
      updatedAt: new Date(),
    });

    if (!updatedSession) {
      throw new NotFoundException(`Failed to update tutoring session with ID "${id}"`);
    }

    return updatedSession;
  }

  async delete(id: string): Promise<boolean> {
    const session = await this.tutoringSessionRepository.findById(id);
    
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID "${id}" not found`);
    }

    return this.tutoringSessionRepository.delete(id);
  }

  // Material methods
  async addMaterial(createMaterialDto: CreateTutoringMaterialDto): Promise<TutoringMaterial> {
    const {
      tutoringId,
      title,
      description,
      type,
      url,
      size,
      uploadedBy,
    } = createMaterialDto;

    // Check if tutoring session exists
    const session = await this.tutoringSessionRepository.findById(tutoringId);
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID "${tutoringId}" not found`);
    }

    const material = new TutoringMaterial({
      id: '',
      tutoringId,
      title,
      description,
      type,
      url,
      size,
      uploadedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.tutoringSessionRepository.addMaterial(material);
  }

  async updateMaterial(id: string, updateData: Partial<TutoringMaterial>): Promise<TutoringMaterial> {
    const updatedMaterial = await this.tutoringSessionRepository.updateMaterial(id, {
      ...updateData,
      updatedAt: new Date(),
    });

    if (!updatedMaterial) {
      throw new NotFoundException(`Failed to update tutoring material with ID "${id}"`);
    }

    return updatedMaterial;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    return this.tutoringSessionRepository.deleteMaterial(id);
  }

  async getMaterials(tutoringId: string): Promise<TutoringMaterial[]> {
    // Check if tutoring session exists
    const session = await this.tutoringSessionRepository.findById(tutoringId);
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID "${tutoringId}" not found`);
    }

    return this.tutoringSessionRepository.getMaterials(tutoringId);
  }

  // Review methods
  async addReview(createReviewDto: CreateTutoringReviewDto): Promise<TutoringReview> {
    const {
      tutoringId,
      studentId,
      rating,
      comment,
    } = createReviewDto;

    // Check if tutoring session exists
    const session = await this.tutoringSessionRepository.findById(tutoringId);
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID "${tutoringId}" not found`);
    }

    const review = new TutoringReview({
      id: '',
      tutoringId,
      studentId,
      rating,
      comment,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.tutoringSessionRepository.addReview(review);
  }

  async updateReview(id: string, updateData: Partial<TutoringReview>): Promise<TutoringReview> {
    const updatedReview = await this.tutoringSessionRepository.updateReview(id, {
      ...updateData,
      updatedAt: new Date(),
    });

    if (!updatedReview) {
      throw new NotFoundException(`Failed to update tutoring review with ID "${id}"`);
    }

    return updatedReview;
  }

  async deleteReview(id: string): Promise<boolean> {
    return this.tutoringSessionRepository.deleteReview(id);
  }

  async getReviews(tutoringId: string): Promise<TutoringReview[]> {
    // Check if tutoring session exists
    const session = await this.tutoringSessionRepository.findById(tutoringId);
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID "${tutoringId}" not found`);
    }

    return this.tutoringSessionRepository.getReviews(tutoringId);
  }

  // Available time methods
  async addAvailableTime(tutoringId: string, createTimeDto: CreateAvailableTimeDto): Promise<TutoringAvailableTime> {
    const {
      dayOfWeek,
      startTime,
      endTime,
    } = createTimeDto;

    // Check if tutoring session exists
    const session = await this.tutoringSessionRepository.findById(tutoringId);
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID "${tutoringId}" not found`);
    }

    const time = new TutoringAvailableTime({
      id: '',
      tutoringId,
      dayOfWeek,
      startTime,
      endTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.tutoringSessionRepository.addAvailableTime(time);
  }

  async updateAvailableTime(id: string, updateData: Partial<TutoringAvailableTime>): Promise<TutoringAvailableTime> {
    const updatedTime = await this.tutoringSessionRepository.updateAvailableTime(id, {
      ...updateData,
      updatedAt: new Date(),
    });

    if (!updatedTime) {
      throw new NotFoundException(`Failed to update tutoring available time with ID "${id}"`);
    }

    return updatedTime;
  }

  async deleteAvailableTime(id: string): Promise<boolean> {
    return this.tutoringSessionRepository.deleteAvailableTime(id);
  }

  async getAvailableTimes(tutoringId: string): Promise<TutoringAvailableTime[]> {
    // Check if tutoring session exists
    const session = await this.tutoringSessionRepository.findById(tutoringId);
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID "${tutoringId}" not found`);
    }

    return this.tutoringSessionRepository.getAvailableTimes(tutoringId);
  }
}
