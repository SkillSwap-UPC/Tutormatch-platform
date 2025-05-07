
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CourseRepository } from '../../domain/repositories/course.repository.interface';
import { Course } from '../../domain/models/course.model';
import { Database } from '../../../types/supabase';

@Injectable()
export class SupabaseCourseRepository implements CourseRepository {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are missing. Please check your environment variables.');
    }
    
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  private mapToModel(data: any): Course {
    return new Course({
      id: data.id,
      name: data.name,
      semesterNumber: data.semester_number,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    });
  }

  private mapToSupabase(course: Partial<Course>): any {
    const mapped: any = {};
    
    if (course.name !== undefined) mapped.name = course.name;
    if (course.semesterNumber !== undefined) mapped.semester_number = course.semesterNumber;
    if (course.updatedAt !== undefined) mapped.updated_at = course.updatedAt?.toISOString();
    
    return mapped;
  }

  async findAll(): Promise<Course[]> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('*');
    
    if (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
    
    return data.map(course => this.mapToModel(course));
  }

  async findById(id: string): Promise<Course | null> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No data found
      }
      throw new Error(`Failed to fetch course: ${error.message}`);
    }
    
    return data ? this.mapToModel(data) : null;
  }

  async findBySemesterNumber(semesterNumber: number): Promise<Course[]> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('*')
      .eq('semester_number', semesterNumber);
    
    if (error) {
      throw new Error(`Failed to fetch courses by semester number: ${error.message}`);
    }
    
    return data.map(course => this.mapToModel(course));
  }

  async create(course: Course): Promise<Course> {
    const { data, error } = await this.supabase
      .from('courses')
      .insert([{
        name: course.name,
        semester_number: course.semesterNumber
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create course: ${error.message}`);
    }
    
    return this.mapToModel(data);
  }

  async update(id: string, course: Partial<Course>): Promise<Course | null> {
    const mappedData = this.mapToSupabase(course);
    
    const { data, error } = await this.supabase
      .from('courses')
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update course: ${error.message}`);
    }
    
    return data ? this.mapToModel(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete course: ${error.message}`);
    }
    
    return true;
  }
}
