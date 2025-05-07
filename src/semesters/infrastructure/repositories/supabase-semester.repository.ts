
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SemesterRepository } from '../../domain/repositories/semester.repository.interface';
import { Semester } from '../../domain/models/semester.model';
import { Course } from '../../../courses/domain/models/course.model';
import { Database } from '../../../types/supabase';

@Injectable()
export class SupabaseSemesterRepository implements SemesterRepository {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are missing. Please check your environment variables.');
    }
    
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  private mapToModel(data: any, courses: Course[] = []): Semester {
    return new Semester({
      id: data.id,
      name: data.name,
      courses,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    });
  }

  private mapCourseToModel(data: any): Course {
    return new Course({
      id: data.id,
      name: data.name,
      semesterNumber: data.semester_number,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    });
  }

  private mapToSupabase(semester: Partial<Semester>): any {
    const mapped: any = {};
    
    if (semester.name !== undefined) mapped.name = semester.name;
    if (semester.updatedAt !== undefined) mapped.updated_at = semester.updatedAt?.toISOString();
    
    return mapped;
  }

  async findAll(): Promise<Semester[]> {
    const { data, error } = await this.supabase
      .from('semesters')
      .select('*');
    
    if (error) {
      throw new Error(`Failed to fetch semesters: ${error.message}`);
    }
    
    // For each semester, get its courses
    const semesters = await Promise.all(
      data.map(async (semester) => {
        const courses = await this.getCourses(semester.id);
        return this.mapToModel(semester, courses);
      })
    );
    
    return semesters;
  }

  async findById(id: string): Promise<Semester | null> {
    const { data, error } = await this.supabase
      .from('semesters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No data found
      }
      throw new Error(`Failed to fetch semester: ${error.message}`);
    }

    if (!data) {
      return null;
    }
    
    const courses = await this.getCourses(id);
    return this.mapToModel(data, courses);
  }

  async create(semester: Semester): Promise<Semester> {
    const { data, error } = await this.supabase
      .from('semesters')
      .insert([{
        name: semester.name
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create semester: ${error.message}`);
    }
    
    return this.mapToModel(data);
  }

  async update(id: string, semester: Partial<Semester>): Promise<Semester | null> {
    const mappedData = this.mapToSupabase(semester);
    
    const { data, error } = await this.supabase
      .from('semesters')
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update semester: ${error.message}`);
    }
    
    if (!data) {
      return null;
    }
    
    const courses = await this.getCourses(id);
    return this.mapToModel(data, courses);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('semesters')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete semester: ${error.message}`);
    }
    
    return true;
  }

  async addCourse(semesterId: string, courseId: string): Promise<void> {
    const { error } = await this.supabase
      .from('semester_courses')
      .insert([{
        semester_id: semesterId,
        course_id: courseId
      }]);
    
    if (error) {
      throw new Error(`Failed to add course to semester: ${error.message}`);
    }
  }

  async removeCourse(semesterId: string, courseId: string): Promise<void> {
    const { error } = await this.supabase
      .from('semester_courses')
      .delete()
      .eq('semester_id', semesterId)
      .eq('course_id', courseId);
    
    if (error) {
      throw new Error(`Failed to remove course from semester: ${error.message}`);
    }
  }

  async getCourses(semesterId: string): Promise<Course[]> {
    const { data, error } = await this.supabase
      .from('semester_courses')
      .select('course_id')
      .eq('semester_id', semesterId);
    
    if (error) {
      throw new Error(`Failed to fetch semester courses: ${error.message}`);
    }
    
    if (data.length === 0) {
      return [];
    }
    
    const courseIds = data.map(item => item.course_id);
    
    const { data: coursesData, error: coursesError } = await this.supabase
      .from('courses')
      .select('*')
      .in('id', courseIds);
    
    if (coursesError) {
      throw new Error(`Failed to fetch courses: ${coursesError.message}`);
    }
    
    return coursesData.map(course => this.mapCourseToModel(course));
  }
}
