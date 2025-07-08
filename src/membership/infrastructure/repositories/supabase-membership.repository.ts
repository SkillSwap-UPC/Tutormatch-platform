import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../types/supabase';
import { Membership } from '../../domain/models/membership.model';
import { MembershipRepository } from '../../domain/repositories/membership.repository.interface';

@Injectable()
export class SupabaseMembershipRepository implements MembershipRepository {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are missing.');
    }
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  async findByUserId(userId: string): Promise<Membership | null> {
    const { data, error } = await this.supabase
      .from('memberships')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return null;
    return this.mapToModel(data);
  }

  async create(membership: Partial<Membership>): Promise<Membership> {
    if (!membership.userId || !membership.type || !membership.status) {
      throw new Error('userId, type y status son requeridos');
    }
    const insertObj = {
      user_id: membership.userId,
      type: membership.type,
      status: membership.status,
      payment_proof: membership.paymentProof ?? null,
    };
    const { data, error } = await this.supabase
      .from('memberships')
      .insert(insertObj)
      .select()
      .single();
    if (error || !data) throw new Error('Error creating membership');
    return this.mapToModel(data);
  }

  async updateStatus(id: string, status: 'pending' | 'active' | 'rejected'): Promise<Membership> {
    const { data, error } = await this.supabase
      .from('memberships')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error || !data) throw new Error('Error updating membership status');
    return this.mapToModel(data);
  }

  private mapToModel(data: any): Membership {
    return new Membership(
      data.id,
      data.user_id,
      data.type,
      data.status,
      data.payment_proof,
      data.created_at ? new Date(data.created_at) : null
    );
  }
}
