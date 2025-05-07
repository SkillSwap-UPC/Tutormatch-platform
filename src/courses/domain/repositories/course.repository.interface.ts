
import { Course } from '../models/course.model';

export abstract class CourseRepository {
  abstract findAll(): Promise<Course[]>;
  abstract findById(id: string): Promise<Course | null>;
  abstract findBySemesterNumber(semesterNumber: number): Promise<Course[]>;
  abstract create(course: Course): Promise<Course>;
  abstract update(id: string, course: Partial<Course>): Promise<Course | null>;
  abstract delete(id: string): Promise<boolean>;
}
