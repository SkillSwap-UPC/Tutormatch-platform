
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TutoringSessionRepository } from '../../domain/repositories/tutoring-session.repository.interface';
import { TutoringSession } from '../../domain/models/tutoring-session.model';
import { TutoringMaterial } from '../../domain/models/tutoring-material.model';
import { TutoringReview } from '../../domain/models/tutoring-review.model';
import { TutoringAvailableTime } from '../../domain/models/tutoring-available-time.model';
import { Database } from '../../../types/supabase';

@Injectable()
export class SupabaseTutoringSessionRepository implements TutoringSessionRepository {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are missing. Please check your environment variables.');
    }
    
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  // Mapping functions
  private mapTutoringSessionToModel(data: any): TutoringSession {
    return new TutoringSession({
      id: data.id,
      tutorId: data.tutor_id,
      courseId: data.course_id,
      title: data.title,
      description: data.description,
      price: data.price,
      whatTheyWillLearn: Array.isArray(data.what_they_will_learn) ? data.what_they_will_learn : [],
      imageUrl: data.image_url,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    });
  }

  private mapMaterialToModel(data: any): TutoringMaterial {
    return new TutoringMaterial({
      id: data.id,
      tutoringId: data.tutoring_id,
      title: data.title,
      description: data.description,
      type: data.type,
      url: data.url,
      size: data.size,
      uploadedBy: data.uploaded_by,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    });
  }

  private mapReviewToModel(data: any): TutoringReview {
    return new TutoringReview({
      id: data.id,
      tutoringId: data.tutoring_id,
      studentId: data.student_id,
      rating: data.rating,
      comment: data.comment,
      likes: data.likes,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    });
  }

  private mapAvailableTimeToModel(data: any): TutoringAvailableTime {
    return new TutoringAvailableTime({
      id: data.id,
      tutoringId: data.tutoring_id,
      dayOfWeek: data.day_of_week,
      startTime: data.start_time,
      endTime: data.end_time,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    });
  }

  private mapSessionToSupabase(session: Partial<TutoringSession>): any {
    const mapped: any = {};
    
    if (session.tutorId !== undefined) mapped.tutor_id = session.tutorId;
    if (session.courseId !== undefined) mapped.course_id = session.courseId;
    if (session.title !== undefined) mapped.title = session.title;
    if (session.description !== undefined) mapped.description = session.description;
    if (session.price !== undefined) mapped.price = session.price;
    if (session.whatTheyWillLearn !== undefined) mapped.what_they_will_learn = session.whatTheyWillLearn;
    if (session.imageUrl !== undefined) mapped.image_url = session.imageUrl;
    if (session.updatedAt !== undefined) mapped.updated_at = session.updatedAt?.toISOString();
    
    return mapped;
  }

  private mapMaterialToSupabase(material: Partial<TutoringMaterial>): any {
    const mapped: any = {};
    
    if (material.tutoringId !== undefined) mapped.tutoring_id = material.tutoringId;
    if (material.title !== undefined) mapped.title = material.title;
    if (material.description !== undefined) mapped.description = material.description;
    if (material.type !== undefined) mapped.type = material.type;
    if (material.url !== undefined) mapped.url = material.url;
    if (material.size !== undefined) mapped.size = material.size;
    if (material.uploadedBy !== undefined) mapped.uploaded_by = material.uploadedBy;
    if (material.updatedAt !== undefined) mapped.updated_at = material.updatedAt?.toISOString();
    
    return mapped;
  }

  private mapReviewToSupabase(review: Partial<TutoringReview>): any {
    const mapped: any = {};
    
    if (review.tutoringId !== undefined) mapped.tutoring_id = review.tutoringId;
    if (review.studentId !== undefined) mapped.student_id = review.studentId;
    if (review.rating !== undefined) mapped.rating = review.rating;
    if (review.comment !== undefined) mapped.comment = review.comment;
    if (review.likes !== undefined) mapped.likes = review.likes;
    if (review.updatedAt !== undefined) mapped.updated_at = review.updatedAt?.toISOString();
    
    return mapped;
  }

  private mapAvailableTimeToSupabase(time: Partial<TutoringAvailableTime>): any {
    const mapped: any = {};
    
    if (time.tutoringId !== undefined) mapped.tutoring_id = time.tutoringId;
    if (time.dayOfWeek !== undefined) mapped.day_of_week = time.dayOfWeek;
    if (time.startTime !== undefined) mapped.start_time = time.startTime;
    if (time.endTime !== undefined) mapped.end_time = time.endTime;
    if (time.updatedAt !== undefined) mapped.updated_at = time.updatedAt?.toISOString();
    
    return mapped;
  }

  // TutoringSession methods
  async findAll(): Promise<TutoringSession[]> {
    const { data, error } = await this.supabase
      .from('tutoring_sessions')
      .select('*');
    
    if (error) {
      throw new Error(`Failed to fetch tutoring sessions: ${error.message}`);
    }
    
    // For each session, fetch materials, reviews, and available times
    const sessions = await Promise.all(
      data.map(async (session) => {
        const materials = await this.getMaterials(session.id);
        const reviews = await this.getReviews(session.id);
        const availableTimes = await this.getAvailableTimes(session.id);
        
        const tutoringSession = this.mapTutoringSessionToModel(session);
        return new TutoringSession({
          ...tutoringSession,
          materials,
          reviews,
          availableTimes,
        });
      })
    );
    
    return sessions;
  }

  async findById(id: string): Promise<TutoringSession | null> {
    const { data, error } = await this.supabase
      .from('tutoring_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No data found
      }
      throw new Error(`Failed to fetch tutoring session: ${error.message}`);
    }
    
    if (!data) {
      return null;
    }
    
    const materials = await this.getMaterials(id);
    const reviews = await this.getReviews(id);
    const availableTimes = await this.getAvailableTimes(id);
    
    const tutoringSession = this.mapTutoringSessionToModel(data);
    return new TutoringSession({
      ...tutoringSession,
      materials,
      reviews,
      availableTimes,
    });
  }

  async findByTutorId(tutorId: string): Promise<TutoringSession[]> {
    const { data, error } = await this.supabase
      .from('tutoring_sessions')
      .select('*')
      .eq('tutor_id', tutorId);
    
    if (error) {
      throw new Error(`Failed to fetch tutoring sessions by tutor: ${error.message}`);
    }
    
    // For each session, fetch materials, reviews, and available times
    const sessions = await Promise.all(
      data.map(async (session) => {
        const materials = await this.getMaterials(session.id);
        const reviews = await this.getReviews(session.id);
        const availableTimes = await this.getAvailableTimes(session.id);
        
        const tutoringSession = this.mapTutoringSessionToModel(session);
        return new TutoringSession({
          ...tutoringSession,
          materials,
          reviews,
          availableTimes,
        });
      })
    );
    
    return sessions;
  }

  async findByStudentId(studentId: string): Promise<TutoringSession[]> {
    const { data, error } = await this.supabase
      .from('tutoring_sessions')
      .select('*')
      .eq('student_id', studentId);
    
    if (error) {
      throw new Error(`Failed to fetch tutoring sessions by student: ${error.message}`);
    }
    
    // For each session, fetch materials, reviews, and available times
    const sessions = await Promise.all(
      data.map(async (session) => {
        const materials = await this.getMaterials(session.id);
        const reviews = await this.getReviews(session.id);
        const availableTimes = await this.getAvailableTimes(session.id);
        
        const tutoringSession = this.mapTutoringSessionToModel(session);
        return new TutoringSession({
          ...tutoringSession,
          materials,
          reviews,
          availableTimes,
        });
      })
    );
    
    return sessions;
  }

  async findByCourseId(courseId: string): Promise<TutoringSession[]> {
    const { data, error } = await this.supabase
      .from('tutoring_sessions')
      .select('*')
      .eq('course_id', courseId);
    
    if (error) {
      throw new Error(`Failed to fetch tutoring sessions by course: ${error.message}`);
    }
    
    // For each session, fetch materials, reviews, and available times
    const sessions = await Promise.all(
      data.map(async (session) => {
        const materials = await this.getMaterials(session.id);
        const reviews = await this.getReviews(session.id);
        const availableTimes = await this.getAvailableTimes(session.id);
        
        const tutoringSession = this.mapTutoringSessionToModel(session);
        return new TutoringSession({
          ...tutoringSession,
          materials,
          reviews,
          availableTimes,
        });
      })
    );
    
    return sessions;
  }

  async create(tutoringSession: TutoringSession): Promise<TutoringSession> {
    const { data, error } = await this.supabase
      .from('tutoring_sessions')
      .insert([{
        tutor_id: tutoringSession.tutorId,
        course_id: tutoringSession.courseId,
        title: tutoringSession.title,
        description: tutoringSession.description,
        price: tutoringSession.price,
        what_they_will_learn: tutoringSession.whatTheyWillLearn,
        image_url: tutoringSession.imageUrl
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create tutoring session: ${error.message}`);
    }
    
    // Create related data
    const sessionId = data.id;
    
    // Add materials if available
    if (tutoringSession.materials && tutoringSession.materials.length > 0) {
      await Promise.all(
        tutoringSession.materials.map(material => 
          this.addMaterial(new TutoringMaterial({ ...material, tutoringId: sessionId }))
        )
      );
    }
    
    // Add available times if available
    if (tutoringSession.availableTimes && tutoringSession.availableTimes.length > 0) {
      await Promise.all(
        tutoringSession.availableTimes.map(time => 
          this.addAvailableTime(new TutoringAvailableTime({ ...time, tutoringId: sessionId }))
        )
      );
    }
    
    const createdSession = await this.findById(sessionId);
    if (!createdSession) {
      throw new Error(`Failed to retrieve created tutoring session with ID: ${sessionId}`);
    }
    
    return createdSession;
  }

  async update(id: string, tutoringSession: Partial<TutoringSession>): Promise<TutoringSession | null> {
    const mappedData = this.mapSessionToSupabase(tutoringSession);
    
    const { data, error } = await this.supabase
      .from('tutoring_sessions')
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update tutoring session: ${error.message}`);
    }
    
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('tutoring_sessions')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete tutoring session: ${error.message}`);
    }
    
    return true;
  }

  // Materials methods
  async addMaterial(material: TutoringMaterial): Promise<TutoringMaterial> {
    const { data, error } = await this.supabase
      .from('tutoring_materials')
      .insert([{
        tutoring_id: material.tutoringId,
        title: material.title,
        description: material.description,
        type: material.type,
        url: material.url,
        size: material.size,
        uploaded_by: material.uploadedBy
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to add tutoring material: ${error.message}`);
    }
    
    return this.mapMaterialToModel(data);
  }

  async updateMaterial(id: string, material: Partial<TutoringMaterial>): Promise<TutoringMaterial | null> {
    const mappedData = this.mapMaterialToSupabase(material);
    
    const { data, error } = await this.supabase
      .from('tutoring_materials')
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update tutoring material: ${error.message}`);
    }
    
    return data ? this.mapMaterialToModel(data) : null;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('tutoring_materials')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete tutoring material: ${error.message}`);
    }
    
    return true;
  }

  async getMaterials(tutoringId: string): Promise<TutoringMaterial[]> {
    const { data, error } = await this.supabase
      .from('tutoring_materials')
      .select('*')
      .eq('tutoring_id', tutoringId);
    
    if (error) {
      throw new Error(`Failed to fetch tutoring materials: ${error.message}`);
    }
    
    return data.map(material => this.mapMaterialToModel(material));
  }

  // Reviews methods
  async addReview(review: TutoringReview): Promise<TutoringReview> {
    const { data, error } = await this.supabase
      .from('tutoring_reviews')
      .insert([{
        tutoring_id: review.tutoringId,
        student_id: review.studentId,
        rating: review.rating,
        comment: review.comment,
        likes: review.likes || 0
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to add tutoring review: ${error.message}`);
    }
    
    return this.mapReviewToModel(data);
  }

  async updateReview(id: string, review: Partial<TutoringReview>): Promise<TutoringReview | null> {
    const mappedData = this.mapReviewToSupabase(review);
    
    const { data, error } = await this.supabase
      .from('tutoring_reviews')
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update tutoring review: ${error.message}`);
    }
    
    return data ? this.mapReviewToModel(data) : null;
  }

  async deleteReview(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('tutoring_reviews')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete tutoring review: ${error.message}`);
    }
    
    return true;
  }

  async getReviews(tutoringId: string): Promise<TutoringReview[]> {
    const { data, error } = await this.supabase
      .from('tutoring_reviews')
      .select('*')
      .eq('tutoring_id', tutoringId);
    
    if (error) {
      throw new Error(`Failed to fetch tutoring reviews: ${error.message}`);
    }
    
    return data.map(review => this.mapReviewToModel(review));
  }

  // Available times methods
  async addAvailableTime(time: TutoringAvailableTime): Promise<TutoringAvailableTime> {
    const { data, error } = await this.supabase
      .from('tutoring_available_times')
      .insert([{
        tutoring_id: time.tutoringId,
        day_of_week: time.dayOfWeek,
        start_time: time.startTime,
        end_time: time.endTime
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to add tutoring available time: ${error.message}`);
    }
    
    return this.mapAvailableTimeToModel(data);
  }

  async updateAvailableTime(id: string, time: Partial<TutoringAvailableTime>): Promise<TutoringAvailableTime | null> {
    const mappedData = this.mapAvailableTimeToSupabase(time);
    
    const { data, error } = await this.supabase
      .from('tutoring_available_times')
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update tutoring available time: ${error.message}`);
    }
    
    return data ? this.mapAvailableTimeToModel(data) : null;
  }

  async deleteAvailableTime(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('tutoring_available_times')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete tutoring available time: ${error.message}`);
    }
    
    return true;
  }

  async getAvailableTimes(tutoringId: string): Promise<TutoringAvailableTime[]> {
    const { data, error } = await this.supabase
      .from('tutoring_available_times')
      .select('*')
      .eq('tutoring_id', tutoringId);
    
    if (error) {
      throw new Error(`Failed to fetch tutoring available times: ${error.message}`);
    }
    
    return data.map(time => this.mapAvailableTimeToModel(time));
  }
}
