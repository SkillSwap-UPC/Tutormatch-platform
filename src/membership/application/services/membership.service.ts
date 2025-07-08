import { Inject, Injectable } from '@nestjs/common';
import { Membership } from '../../domain/models/membership.model';
import { MembershipRepository } from '../../domain/repositories/membership.repository.interface';

export const MEMBERSHIP_REPOSITORY = 'MEMBERSHIP_REPOSITORY';

@Injectable()
export class MembershipService {
  constructor(
    @Inject(MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: MembershipRepository
  ) {}

  async getMyMembership(userId: string): Promise<Membership | null> {
    return this.membershipRepository.findByUserId(userId);
  }

  async createMembership(data: Partial<Membership>): Promise<Membership> {
    return this.membershipRepository.create(data);
  }

  async updateMembershipStatus(id: string, status: 'pending' | 'active' | 'rejected'): Promise<Membership> {
    return this.membershipRepository.updateStatus(id, status);
  }
}
