export class Membership {
  constructor(
    public id: string,
    public userId: string,
    public type: 'BASIC' | 'STANDARD' | 'PREMIUM',
    public status: 'pending' | 'active' | 'rejected',
    public paymentProof: string | null,
    public createdAt: Date | null
  ) {}
}
