
import { Profile } from '../models/profile.model';

export interface ProfileRepository {
  findAll(): Promise<Profile[]>;
  findById(id: string): Promise<Profile | null>;
  findByEmail(email: string): Promise<Profile | null>;
  create(profile: Profile): Promise<Profile>;
  update(id: string, profile: Partial<Profile>): Promise<Profile | null>;
  delete(id: string): Promise<boolean>;
}
