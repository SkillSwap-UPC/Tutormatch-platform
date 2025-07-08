import { Membership } from '../models/membership.model';

export interface MembershipRepository {
  findByUserId(userId: string): Promise<Membership | null>;
  create(membership: Partial<Membership>): Promise<Membership>;
  updateStatus(id: string, status: 'pending' | 'active' | 'rejected'): Promise<Membership>;
  findAll(): Promise<Membership[]>;
}
