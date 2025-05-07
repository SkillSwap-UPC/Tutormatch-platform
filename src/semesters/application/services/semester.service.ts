
import { Injectable, NotFoundException } from '@nestjs/common';
import { Semester } from '../../domain/models/semester.model';
import { SemesterRepository } from '../../domain/repositories/semester.repository.interface';
import { CourseRepository } from '../../../courses/domain/repositories/course.repository.interface';
import { CreateSemesterDto } from '../dtos/create-semester.dto';
import { UpdateSemesterDto } from '../dtos/update-semester.dto';

@Injectable()
export class SemesterService {
  constructor(
    private readonly semesterRepository: SemesterRepository,
    private readonly courseRepository: CourseRepository
  ) {}

  async findAll(): Promise<Semester[]> {
    return this.semesterRepository.findAll();
  }

  async findById(id: string): Promise<Semester> {
    const semester = await this.semesterRepository.findById(id);
    if (!semester) {
      throw new NotFoundException(`Semester with ID "${id}" not found`);
    }
    return semester;
  }

  async create(createSemesterDto: CreateSemesterDto): Promise<Semester> {
    const { name } = createSemesterDto;

    const semester = new Semester({
      id: '',
      name,
      courses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.semesterRepository.create(semester);
  }

  async update(id: string, updateSemesterDto: UpdateSemesterDto): Promise<Semester> {
    const existingSemester = await this.semesterRepository.findById(id);

    if (!existingSemester) {
      throw new NotFoundException(`Semester with ID "${id}" not found`);
    }

    const updatedSemester = await this.semesterRepository.update(id, {
      ...updateSemesterDto,
      updatedAt: new Date(),
    });

    if (!updatedSemester) {
      throw new NotFoundException(`Failed to update semester with ID "${id}"`);
    }

    return updatedSemester;
  }

  async delete(id: string): Promise<boolean> {
    const semester = await this.semesterRepository.findById(id);
    
    if (!semester) {
      throw new NotFoundException(`Semester with ID "${id}" not found`);
    }

    return this.semesterRepository.delete(id);
  }

  async addCourseToSemester(semesterId: string, courseId: string): Promise<Semester> {
    // Check if semester exists
    const semester = await this.semesterRepository.findById(semesterId);
    if (!semester) {
      throw new NotFoundException(`Semester with ID "${semesterId}" not found`);
    }
    
    // Check if course exists
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }
    
    // Add course to semester
    await this.semesterRepository.addCourse(semesterId, courseId);
    
    // Return updated semester
    const updatedSemester = await this.semesterRepository.findById(semesterId);
    if (!updatedSemester) {
      throw new NotFoundException(`Semester with ID "${semesterId}" not found after update`);
    }
    return updatedSemester;
  }

  async removeCourseFromSemester(semesterId: string, courseId: string): Promise<Semester> {
    // Check if semester exists
    const semester = await this.semesterRepository.findById(semesterId);
    if (!semester) {
      throw new NotFoundException(`Semester with ID "${semesterId}" not found`);
    }
    
    // Remove course from semester
    await this.semesterRepository.removeCourse(semesterId, courseId);
    
    // Return updated semester
    const updatedSemester = await this.semesterRepository.findById(semesterId);
    if (!updatedSemester) {
      throw new NotFoundException(`Semester with ID "${semesterId}" not found after update`);
    }
    return updatedSemester;
  }

  async getSemesterCourses(semesterId: string): Promise<Semester> {
    const semester = await this.semesterRepository.findById(semesterId);
    if (!semester) {
      throw new NotFoundException(`Semester with ID "${semesterId}" not found`);
    }
    return semester;
  }
}
