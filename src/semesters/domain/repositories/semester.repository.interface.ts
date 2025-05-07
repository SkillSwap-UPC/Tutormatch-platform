
import { Semester } from '../models/semester.model';
import { Course } from '../../../courses/domain/models/course.model';

export abstract class SemesterRepository {
  abstract findAll(): Promise<Semester[]>;
  abstract findById(id: string): Promise<Semester | null>;
  abstract create(semester: Semester): Promise<Semester>;
  abstract update(id: string, semester: Partial<Semester>): Promise<Semester | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract addCourse(semesterId: string, courseId: string): Promise<void>;
  abstract removeCourse(semesterId: string, courseId: string): Promise<void>;
  abstract getCourses(semesterId: string): Promise<Course[]>;
}
