
import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from '../../domain/models/course.model';
import { CourseRepository } from '../../domain/repositories/course.repository.interface';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return course;
  }

  async findBySemesterNumber(semesterNumber: number): Promise<Course[]> {
    return this.courseRepository.findBySemesterNumber(semesterNumber);
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { name, semesterNumber } = createCourseDto;

    const course = new Course({
      id: '',
      name,
      semesterNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.courseRepository.create(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const existingCourse = await this.courseRepository.findById(id);

    if (!existingCourse) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    const updatedCourse = await this.courseRepository.update(id, {
      ...updateCourseDto,
      updatedAt: new Date(),
    });

    if (!updatedCourse) {
      throw new NotFoundException(`Failed to update course with ID "${id}"`);
    }

    return updatedCourse;
  }

  async delete(id: string): Promise<boolean> {
    const course = await this.courseRepository.findById(id);
    
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    return this.courseRepository.delete(id);
  }
}
