export interface User {
  id: string;
  email: string;
  profile: Profile;
}

export interface Profile {
  id: string;
  type: 'ATHLETE' | 'TEAM';
  name: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  coverUrl?: string;
  sport?: string;
  position?: string;
  birthDate?: string;
  height?: string;
  weight?: string;
  teamSize?: number;
  founded?: string;
  skills?: Skill[];
  resume?: Resume;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  description?: string;
}

export interface Resume {
  education?: string;
  experience?: string;
  achievements?: string;
  certifications?: string;
}

export interface Post {
  id: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO';
  content?: string;
  mediaUrl?: string;
  user: User;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
