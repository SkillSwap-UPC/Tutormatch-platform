import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { CreateMembershipDto } from '../dtos/create-membership.dto';
import { UpdateMembershipStatusDto } from '../dtos/update-membership-status.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MembershipService } from '../../application/services/membership.service';
import { Membership } from '../../domain/models/membership.model';

@ApiTags('memberships')
@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener la membresía activa de un usuario por su userId' })
  @ApiResponse({ status: 200, description: 'Membresía encontrada', type: Membership })
  async getMembershipByUserId(@Param('userId') userId: string): Promise<Membership | null> {
    return this.membershipService.getMyMembership(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva membresía para un usuario' })
  @ApiResponse({ status: 201, description: 'Membresía creada', type: Membership })
  async createMembership(@Body() body: CreateMembershipDto): Promise<Membership> {
    return this.membershipService.createMembership({
      userId: body.user_id,
      type: body.type,
      status: body.status,
      paymentProof: body.payment_proof,
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el status de una membresía' })
  @ApiResponse({ status: 200, description: 'Membresía actualizada', type: Membership })
  async updateMembershipStatus(
    @Param('id') id: string,
    @Body() body: UpdateMembershipStatusDto,
  ): Promise<Membership> {
    return this.membershipService.updateMembershipStatus(id, body.status);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las membresías' })
  @ApiResponse({ status: 200, description: 'Lista de membresías', type: [Membership] })
  async getAllMemberships(): Promise<Membership[]> {
    return this.membershipService.getAllMemberships();
  }
}
