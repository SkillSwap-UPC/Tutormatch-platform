
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile } from '../../domain/models/profile.model';
import { ProfileRepository } from '../../domain/repositories/profile.repository.interface';
import { Database } from '../../../types/supabase';

@Injectable()
export class SupabaseProfileRepository implements ProfileRepository {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are missing. Please check your environment variables.');
    }
    
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  private mapToModel(data: any): Profile {
    return new Profile({
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      gender: data.gender,
      role: data.role,
      semesterNumber: data.semester_number,
      academicYear: data.academic_year,
      avatar: data.avatar,
      bio: data.bio,
      phone: data.phone,
      status: data.status,
      tutorId: data.tutor_id,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    });
  }

  private mapToSupabase(profile: Partial<Profile>): any {
    const mapped: any = {};
    
    if (profile.email !== undefined) mapped.email = profile.email;
    if (profile.firstName !== undefined) mapped.first_name = profile.firstName;
    if (profile.lastName !== undefined) mapped.last_name = profile.lastName;
    if (profile.gender !== undefined) mapped.gender = profile.gender;
    if (profile.role !== undefined) mapped.role = profile.role;
    if (profile.semesterNumber !== undefined) mapped.semester_number = profile.semesterNumber;
    if (profile.academicYear !== undefined) mapped.academic_year = profile.academicYear;
    if (profile.avatar !== undefined) mapped.avatar = profile.avatar;
    if (profile.bio !== undefined) mapped.bio = profile.bio;
    if (profile.phone !== undefined) mapped.phone = profile.phone;
    if (profile.status !== undefined) mapped.status = profile.status;
    if (profile.tutorId !== undefined) mapped.tutor_id = profile.tutorId;
    if (profile.updatedAt !== undefined) mapped.updated_at = profile.updatedAt?.toISOString();
    
    return mapped;
  }

  async findAll(): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }
    
    return data.map(profile => this.mapToModel(profile));
  }

  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No data found
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
    
    return data ? this.mapToModel(data) : null;
  }

  async findByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No data found
      }
      throw new Error(`Failed to fetch profile by email: ${error.message}`);
    }
    
    return data ? this.mapToModel(data) : null;
  }

  async create(profile: Profile): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert([
        {
          id: profile.id,
          email: profile.email,
          first_name: profile.firstName,
          last_name: profile.lastName,
          gender: profile.gender,
          role: profile.role,
          semester_number: profile.semesterNumber,
          academic_year: profile.academicYear,
          avatar: profile.avatar,
          bio: profile.bio,
          phone: profile.phone,
          status: profile.status,
          tutor_id: profile.tutorId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
    
    return this.mapToModel(data);
  }

  async update(id: string, profile: Partial<Profile>): Promise<Profile | null> {
    const mappedData = this.mapToSupabase(profile);
    
    const { data, error } = await this.supabase
      .from('profiles')
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    
    return data ? this.mapToModel(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
    
    return true;
  }
}
