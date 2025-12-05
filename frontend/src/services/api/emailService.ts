import { apiClient } from '../api';
import { SingleResponse } from '../../types/api';

export interface EmailSettings {
  id: string;
  awsAccessKeyId: string | null;
  awsSecretAccessKey: string | null;
  awsRegion: string | null;
  senderEmail: string | null;
  senderName: string | null;
  isEnabled: boolean;
  isConfigured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmailSettingsData {
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsRegion?: string;
  senderEmail?: string;
  senderName?: string;
  isEnabled?: boolean;
}

export interface SendTestEmailData {
  recipientEmail: string;
  subject: string;
  body: string;
}

export interface SendTestEmailResponse {
  success: boolean;
  messageId?: string;
  message: string;
}

export interface EmailLog {
  id: string;
  type: string;
  status: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  errorMessage?: string;
  messageId?: string;
  course?: any;
  recipientUser?: any;
  createdAt: string;
  sentAt?: string;
}

export interface EmailLogFilters {
  type?: string;
  status?: string;
  courseId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EmailLogsResponse {
  data: EmailLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmailStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  byType: Array<{ type: string; count: number }>;
  last30Days: number;
}

export const emailService = {
  getSettings: (): Promise<SingleResponse<EmailSettings>> => {
    return apiClient.get<SingleResponse<EmailSettings>>('/email/settings');
  },

  updateSettings: (data: UpdateEmailSettingsData): Promise<SingleResponse<EmailSettings>> => {
    return apiClient.put<SingleResponse<EmailSettings>>('/email/settings', data);
  },

  sendTestEmail: (data: SendTestEmailData): Promise<SingleResponse<SendTestEmailResponse>> => {
    return apiClient.post<SingleResponse<SendTestEmailResponse>>('/email/test', data);
  },

  getEmailLogs: (filters?: EmailLogFilters): Promise<EmailLogsResponse> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.courseId) params.append('courseId', filters.courseId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return apiClient.get<EmailLogsResponse>(`/email/logs?${params.toString()}`);
  },

  getEmailLogById: (id: string): Promise<SingleResponse<EmailLog>> => {
    return apiClient.get<SingleResponse<EmailLog>>(`/email/logs/${id}`);
  },

  getEmailStats: (): Promise<SingleResponse<EmailStats>> => {
    return apiClient.get<SingleResponse<EmailStats>>('/email/logs/stats');
  },
};
