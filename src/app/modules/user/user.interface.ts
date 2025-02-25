import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  name: string;
  gender: 'male' | 'female' | 'other';
  image: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: 'customer' | 'admin'; // default 'customer'
  status: 'in-progress' | 'blocked'; // default 'in-progress'
  address: string;
  city: string;
  phone: string;
  isDeleted: boolean; // default: false
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE; // 'customer' | 'admin'

export type TLoginUser = {
  email: string;
  password: string;
};
