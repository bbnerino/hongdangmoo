// 타입 정의
export interface Sentence {
  id: number;
  sentence: string;
  description: string;
}

export interface Settings {
  interval: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

