
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MembershipController } from './interfaces/controllers/membership.controller';
import { MembershipService, MEMBERSHIP_REPOSITORY } from './application/services/membership.service';
import { SupabaseMembershipRepository } from './infrastructure/repositories/supabase-membership.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MEMBERSHIP_REPOSITORY,
      useClass: SupabaseMembershipRepository,
    },
    MembershipService,
  ],
  controllers: [MembershipController],
  exports: [MembershipService],
})
export class MembershipModule {}
