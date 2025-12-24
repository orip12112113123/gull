import axios from 'axios';
import { AuthResponse, Post, Profile } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signup = (data: {
  email: string;
  password: string;
  name: string;
  type: 'ATHLETE' | 'TEAM';
}) => api.post<AuthResponse>('/auth/signup', data);

export const login = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data);

// Profiles
export const getProfile = (id: string) =>
  api.get<Profile>(`/profiles/${id}`);

export const updateProfile = (data: Partial<Profile>) =>
  api.put<Profile>('/profiles', data);

export const addSkill = (data: { name: string; level: number; description?: string }) =>
  api.post('/profiles/skills', data);

export const updateResume = (data: {
  education?: string;
  experience?: string;
  achievements?: string;
  certifications?: string;
}) => api.put('/profiles/resume', data);

export const exploreProfiles = (params?: { sport?: string; type?: string }) =>
  api.get<Profile[]>('/profiles/explore', { params });

// Posts
export const createPost = (data: {
  type: 'TEXT' | 'IMAGE' | 'VIDEO';
  content?: string;
  mediaUrl?: string;
}) => api.post<Post>('/posts', data);

export const getFeed = () => api.get<Post[]>('/posts/feed');

export const likePost = (postId: string) =>
  api.post(`/posts/${postId}/like`);

export const unlikePost = (postId: string) =>
  api.delete(`/posts/${postId}/like`);

export const commentOnPost = (postId: string, content: string) =>
  api.post(`/posts/${postId}/comments`, { content });
