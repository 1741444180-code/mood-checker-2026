export interface User {
  id: number | string;
  username: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
  lastLogin?: string | null;
  timezone?: string;
}

export interface DeactivateAccountResponse {
  success: boolean;
  message?: string;
  error?: string;
  deactivatedUserId?: number | string;
}

export interface UserProfile {
  id: number | string;
  username: string;
  email: string;
  avatar?: string | null;
  totalCheckins: number;
  streak: number;
  weeklyCompletion: number;
}

export interface UserData {
  id: number | string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
  deactivatedAt?: string | null;
  settings?: any;
  privacy?: any;
  profile?: any;
  preferences?: any;
  moodRecords?: any[];
}

export interface GetUserDataResponse {
  success: boolean;
  data?: UserData;
  error?: string;
}
