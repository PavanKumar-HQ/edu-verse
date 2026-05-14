const API_BASE_URL = 'http://localhost:5001/api/v1';

export const aiService = {
  async getExplanation(topic: string, mode = 'Standard', context = '') {
    const res = await fetch(`${API_BASE_URL}/ai/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, mode, context })
    });
    return res.json();
  },

  async getQuiz(topic: string, difficulty = 'Beginner', count = 5) {
    const res = await fetch(`${API_BASE_URL}/ai/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, count })
    });
    return res.json();
  },

  async compressConcept(topic: string, detail: string) {
    const res = await fetch(`${API_BASE_URL}/ai/compress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, detail })
    });
    return res.json();
  },

  async getAnalogies(topic: string) {
    const res = await fetch(`${API_BASE_URL}/ai/analogies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    return res.json();
  },

  async getHints(topic: string, question: string) {
    const res = await fetch(`${API_BASE_URL}/ai/hints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, question })
    });
    return res.json();
  },

  async detectMisconceptions(topic: string, answer: string) {
    const res = await fetch(`${API_BASE_URL}/ai/detect-misconceptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, answer })
    });
    return res.json();
  }
};

export const adaptiveService = {
  async getAnalytics(userId: string) {
    const res = await fetch(`${API_BASE_URL}/adaptive/analytics/${userId}`);
    return res.json();
  },

  async getPacing(mode: string, difficulty: string) {
    const res = await fetch(`${API_BASE_URL}/adaptive/pacing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, difficulty })
    });
    return res.json();
  }
};

export const progressService = {
  async updateProgress(userId: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/progress/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    });
    return res.json();
  },

  async getProgress(userId: string) {
    const res = await fetch(`${API_BASE_URL}/progress/${userId}`);
    return res.json();
  }
};

export const recommendationService = {
  async getRecommendations(userId: string) {
    const res = await fetch(`${API_BASE_URL}/recommendation/${userId}`);
    return res.json();
  }
};
