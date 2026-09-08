let activeApiBaseUrl = 'http://localhost:5000/api';

const getApiBaseUrl = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/health', { signal: AbortSignal.timeout(800) });
    if (res.ok) {
      activeApiBaseUrl = 'http://localhost:5000/api';
      return activeApiBaseUrl;
    }
  } catch {
    activeApiBaseUrl = 'http://localhost:5001/api';
  }
  return activeApiBaseUrl;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('trainer_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const apiService = {
  // Auth
  async register(name, email, password) {
    const baseUrl = await getApiBaseUrl();
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Register failed');
    if (data.token) localStorage.setItem('trainer_token', data.token);
    return data;
  },

  async login(email, password) {
    const baseUrl = await getApiBaseUrl();
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.token) localStorage.setItem('trainer_token', data.token);
    return data;
  },

  async getMe() {
    const baseUrl = await getApiBaseUrl();
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  },

  logout() {
    localStorage.removeItem('trainer_token');
  },

  // Teams
  async saveTeam(teamData) {
    const baseUrl = await getApiBaseUrl();
    const res = await fetch(`${baseUrl}/teams`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(teamData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Save team failed');
    return data;
  },

  async getUserTeams() {
    const baseUrl = await getApiBaseUrl();
    const res = await fetch(`${baseUrl}/teams`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async getPublicTeams() {
    const baseUrl = await getApiBaseUrl();
    const res = await fetch(`${baseUrl}/teams/public`);
    if (!res.ok) return [];
    return await res.json();
  },

  async deleteTeam(id) {
    const baseUrl = await getApiBaseUrl();
    const res = await fetch(`${baseUrl}/teams/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Delete team failed');
    return data;
  },

  // Battles
  async saveBattleLog(battleData) {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/battles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battleData)
      });
      return await res.json();
    } catch (e) {
      console.warn('Could not save battle log to MongoDB:', e);
      return null;
    }
  },

  async getRecentBattles() {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/battles`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // Analytics (MongoDB Aggregation Pipelines)
  async getTopTeamPokemons() {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/analytics/top-pokemons`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async getTypePopularity() {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/analytics/type-popularity`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async getWinRates() {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/analytics/win-rates`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // Quiz / Mini-game
  async saveQuizScore(scoreData) {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/quiz/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async getQuizLeaderboard() {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/quiz/leaderboard`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }
};
