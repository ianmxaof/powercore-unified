/**
 * PowerCore API Client
 * Typed API client for all frontend API calls
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003';

// ============================================================================
// Types
// ============================================================================

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  equippedSkills: string[];
  maxSkillSlots: number;
  creator: {
    id: string;
    name: string;
    verified: boolean;
  };
  tier: 'free' | 'pro' | 'enterprise';
  visibility: 'private' | 'public' | 'marketplace';
  price?: number;
  priceType?: 'one-time' | 'monthly' | 'free';
  installs: number;
  rating: number;
  totalRuns: number;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  manifest: {
    instructions: string;
    requirements: string[];
    examples: Array<{ input: string; output: string }>;
  };
  creator: {
    id: string;
    name: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  price: number;
  priceType: 'one-time' | 'monthly' | 'free';
  verified: boolean;
  installs: number;
  rating: number;
  compatibleModels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillPack {
  id: string;
  name: string;
  description: string;
  skills: string[];
  price: number;
  savings: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  referralCode: string;
  credits: number;
  tier: 'free' | 'pro' | 'enterprise';
  verified: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  itemType: 'agent' | 'skill' | 'subscription' | 'credits';
  itemId: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'crypto' | 'x402' | 'credits';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// ============================================================================
// API Client Class
// ============================================================================

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: 'Unknown error',
          message: response.statusText,
          statusCode: response.status,
        }));
        throw error;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }
      throw {
        error: 'Network error',
        message: 'Failed to connect to the server',
        statusCode: 0,
      } as ApiError;
    }
  }

  // ==========================================================================
  // Agents
  // ==========================================================================

  agents = {
    list: (params?: {
      page?: number;
      pageSize?: number;
      category?: string;
      search?: string;
      sort?: 'popular' | 'rating' | 'newest' | 'price_asc' | 'price_desc';
    }): Promise<PaginatedResponse<Agent>> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
      if (params?.category) searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.sort) searchParams.set('sort', params.sort);
      
      const query = searchParams.toString();
      return this.request<PaginatedResponse<Agent>>(`/agents${query ? `?${query}` : ''}`);
    },

    get: (id: string): Promise<Agent> => {
      return this.request<Agent>(`/agents/${id}`);
    },

    create: (data: Partial<Agent>): Promise<Agent> => {
      return this.request<Agent>('/agents', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: (id: string, data: Partial<Agent>): Promise<Agent> => {
      return this.request<Agent>(`/agents/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    delete: (id: string): Promise<void> => {
      return this.request<void>(`/agents/${id}`, {
        method: 'DELETE',
      });
    },

    publish: (id: string, data: { price: number; priceType: string }): Promise<Agent> => {
      return this.request<Agent>(`/agents/${id}/publish`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    equipSkill: (agentId: string, skillId: string): Promise<Agent> => {
      return this.request<Agent>(`/agents/${agentId}/skills/${skillId}`, {
        method: 'POST',
      });
    },

    unequipSkill: (agentId: string, skillId: string): Promise<Agent> => {
      return this.request<Agent>(`/agents/${agentId}/skills/${skillId}`, {
        method: 'DELETE',
      });
    },

    run: (id: string, input: { message: string; context?: Record<string, unknown> }): Promise<{ response: string; usage: { tokens: number } }> => {
      return this.request(`/agents/${id}/run`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },
  };

  // ==========================================================================
  // Skills
  // ==========================================================================

  skills = {
    list: (params?: {
      page?: number;
      pageSize?: number;
      category?: string;
      search?: string;
      sort?: 'popular' | 'rating' | 'newest' | 'price_asc' | 'price_desc';
    }): Promise<PaginatedResponse<Skill>> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
      if (params?.category) searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.sort) searchParams.set('sort', params.sort);
      
      const query = searchParams.toString();
      return this.request<PaginatedResponse<Skill>>(`/skills${query ? `?${query}` : ''}`);
    },

    get: (id: string): Promise<Skill> => {
      return this.request<Skill>(`/skills/${id}`);
    },

    purchase: (id: string, paymentMethod: string): Promise<{ success: boolean; transactionId: string }> => {
      return this.request(`/skills/${id}/purchase`, {
        method: 'POST',
        body: JSON.stringify({ paymentMethod }),
      });
    },

    packs: (): Promise<SkillPack[]> => {
      return this.request<SkillPack[]>('/skills/packs');
    },

    purchasePack: (packId: string, paymentMethod: string): Promise<{ success: boolean; transactionId: string }> => {
      return this.request(`/skills/packs/${packId}/purchase`, {
        method: 'POST',
        body: JSON.stringify({ paymentMethod }),
      });
    },
  };

  // ==========================================================================
  // Users
  // ==========================================================================

  users = {
    me: (): Promise<User> => {
      return this.request<User>('/users/me');
    },

    update: (data: Partial<User>): Promise<User> => {
      return this.request<User>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    myAgents: (): Promise<Agent[]> => {
      return this.request<Agent[]>('/users/me/agents');
    },

    mySkills: (): Promise<Skill[]> => {
      return this.request<Skill[]>('/users/me/skills');
    },

    myPayments: (): Promise<Payment[]> => {
      return this.request<Payment[]>('/users/me/payments');
    },

    credits: (): Promise<{ balance: number; lifetimeEarned: number; lifetimeSpent: number }> => {
      return this.request('/users/me/credits');
    },

    exportData: (): Promise<Blob> => {
      return fetch(`${this.baseUrl}/users/me/export`, {
        headers: this.defaultHeaders,
      }).then(res => res.blob());
    },

    deleteAccount: (): Promise<void> => {
      return this.request<void>('/users/me', {
        method: 'DELETE',
      });
    },
  };

  // ==========================================================================
  // Payments
  // ==========================================================================

  payments = {
    createCheckout: (data: {
      itemType: 'agent' | 'skill' | 'subscription' | 'credits';
      itemId: string;
      paymentMethod: 'stripe' | 'crypto' | 'credits';
    }): Promise<{ checkoutUrl?: string; clientSecret?: string }> => {
      return this.request('/payments/checkout', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    verify: (sessionId: string): Promise<{ success: boolean; payment: Payment }> => {
      return this.request(`/payments/verify/${sessionId}`);
    },
  };

  // ==========================================================================
  // Search
  // ==========================================================================

  search = {
    global: (query: string): Promise<{ agents: Agent[]; skills: Skill[] }> => {
      return this.request(`/search?q=${encodeURIComponent(query)}`);
    },
  };

  // ==========================================================================
  // Auth
  // ==========================================================================

  auth = {
    login: (credentials: { email: string; password: string }): Promise<{ token: string; user: User }> => {
      return this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },

    register: (data: { email: string; password: string; name: string; referralCode?: string }): Promise<{ token: string; user: User }> => {
      return this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    logout: (): Promise<void> => {
      return this.request<void>('/auth/logout', {
        method: 'POST',
      });
    },

    forgotPassword: (email: string): Promise<{ success: boolean }> => {
      return this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    resetPassword: (token: string, password: string): Promise<{ success: boolean }> => {
      return this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
    },
  };

  // ==========================================================================
  // Referrals
  // ==========================================================================

  referrals = {
    stats: (): Promise<{ referralCode: string; totalReferrals: number; earnedCredits: number }> => {
      return this.request('/referrals/stats');
    },

    list: (): Promise<Array<{ id: string; referredEmail: string; status: string; rewardAmount: number; createdAt: string }>> => {
      return this.request('/referrals');
    },
  };

  // ==========================================================================
  // Creator
  // ==========================================================================

  creator = {
    analytics: (): Promise<{
      totalRevenue: number;
      totalSales: number;
      totalViews: number;
      conversionRate: number;
      revenueByDay: Array<{ date: string; revenue: number }>;
      topAgents: Array<{ id: string; name: string; sales: number; revenue: number }>;
    }> => {
      return this.request('/creator/analytics');
    },

    payouts: (): Promise<Array<{
      id: string;
      amount: number;
      status: string;
      periodStart: string;
      periodEnd: string;
      createdAt: string;
    }>> => {
      return this.request('/creator/payouts');
    },
  };
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const api = new ApiClient(API_BASE);

// ============================================================================
// React Query helpers (optional, if using React Query)
// ============================================================================

export const queryKeys = {
  agents: {
    all: ['agents'] as const,
    list: (params?: Record<string, unknown>) => ['agents', 'list', params] as const,
    detail: (id: string) => ['agents', 'detail', id] as const,
  },
  skills: {
    all: ['skills'] as const,
    list: (params?: Record<string, unknown>) => ['skills', 'list', params] as const,
    detail: (id: string) => ['skills', 'detail', id] as const,
    packs: ['skills', 'packs'] as const,
  },
  user: {
    me: ['user', 'me'] as const,
    agents: ['user', 'agents'] as const,
    skills: ['user', 'skills'] as const,
    payments: ['user', 'payments'] as const,
    credits: ['user', 'credits'] as const,
  },
  creator: {
    analytics: ['creator', 'analytics'] as const,
    payouts: ['creator', 'payouts'] as const,
  },
  referrals: {
    stats: ['referrals', 'stats'] as const,
    list: ['referrals', 'list'] as const,
  },
};
