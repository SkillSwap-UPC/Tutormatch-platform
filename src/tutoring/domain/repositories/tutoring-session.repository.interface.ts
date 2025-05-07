
import { TutoringSession } from '../models/tutoring-session.model';
import { TutoringMaterial } from '../models/tutoring-material.model';
import { TutoringReview } from '../models/tutoring-review.model';
import { TutoringAvailableTime } from '../models/tutoring-available-time.model';

export abstract class TutoringSessionRepository {
  abstract findAll(): Promise<TutoringSession[]>;
  abstract findById(id: string): Promise<TutoringSession | null>;
  abstract findByTutorId(tutorId: string): Promise<TutoringSession[]>;
  abstract findByCourseId(courseId: string): Promise<TutoringSession[]>;
  abstract create(tutoringSession: TutoringSession): Promise<TutoringSession>;
  abstract update(id: string, tutoringSession: Partial<TutoringSession>): Promise<TutoringSession | null>;
  abstract delete(id: string): Promise<boolean>;
  
  // Materials methods
  abstract addMaterial(material: TutoringMaterial): Promise<TutoringMaterial>;
  abstract updateMaterial(id: string, material: Partial<TutoringMaterial>): Promise<TutoringMaterial | null>;
  abstract deleteMaterial(id: string): Promise<boolean>;
  abstract getMaterials(tutoringId: string): Promise<TutoringMaterial[]>;
  
  // Reviews methods
  abstract addReview(review: TutoringReview): Promise<TutoringReview>;
  abstract updateReview(id: string, review: Partial<TutoringReview>): Promise<TutoringReview | null>;
  abstract deleteReview(id: string): Promise<boolean>;
  abstract getReviews(tutoringId: string): Promise<TutoringReview[]>;
  
  // Available times methods
  abstract addAvailableTime(time: TutoringAvailableTime): Promise<TutoringAvailableTime>;
  abstract updateAvailableTime(id: string, time: Partial<TutoringAvailableTime>): Promise<TutoringAvailableTime | null>;
  abstract deleteAvailableTime(id: string): Promise<boolean>;
  abstract getAvailableTimes(tutoringId: string): Promise<TutoringAvailableTime[]>;
}
