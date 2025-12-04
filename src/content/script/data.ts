import { Sentence } from './types';

// 데이터 파일 로드
export async function loadSentences(difficulty: string): Promise<Sentence[]> {
  try {
    const url = chrome.runtime.getURL(`data/${difficulty}.json`);
    console.log(`[Hongdangmoo] Loading sentences from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Sentence[] = await response.json();
    console.log(`[Hongdangmoo] Loaded ${data.length} sentences`);
    return data;
  } catch (error) {
    console.error('[Hongdangmoo] Failed to load sentences:', error);
    return [];
  }
}

// 랜덤 문장 선택
export function getRandomSentence(sentences: Sentence[]): Sentence | null {
  if (sentences.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
}

