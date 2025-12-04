import React, { useState, useEffect } from 'react';
import './Settings.css';

interface SettingsData {
  interval: number; // 분 단위
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

function Settings(): JSX.Element {
  const [settings, setSettings] = useState<SettingsData>({
    interval: 5,
    difficulty: 'beginner'
  });

  useEffect(() => {
    // 저장된 설정 불러오기
    chrome.storage.sync.get(['interval', 'difficulty'], (result) => {
      if (typeof result.interval === 'number') {
        setSettings(prev => ({ ...prev, interval: result.interval as number }));
      }
      if (result.difficulty === 'beginner' || result.difficulty === 'intermediate' || result.difficulty === 'advanced') {
        setSettings(prev => ({ ...prev, difficulty: result.difficulty as 'beginner' | 'intermediate' | 'advanced' }));
      }
    });
  }, []);

  const handleIntervalChange = (interval: number): void => {
    const newSettings = { ...settings, interval };
    setSettings(newSettings);
    chrome.storage.sync.set({ interval }, () => {
      // 설정 변경은 storage.onChanged로 background에서 자동 처리됨
      console.log('[Settings] Interval changed to:', interval);
    });
  };

  const handleDifficultyChange = (difficulty: 'beginner' | 'intermediate' | 'advanced'): void => {
    const newSettings = { ...settings, difficulty };
    setSettings(newSettings);
    chrome.storage.sync.set({ difficulty }, () => {
      // 설정 변경은 storage.onChanged로 background에서 자동 처리됨
      console.log('[Settings] Difficulty changed to:', difficulty);
    });
  };

  const intervals = [
    { value: 10 / 60, label: '10초 (테스트)' },
    { value: 1, label: '1분' },
    { value: 3, label: '3분' },
    { value: 5, label: '5분' },
    { value: 10, label: '10분' },
    { value: 30, label: '30분' }
  ];
  const difficulties = [
    { value: 'beginner', label: '초보' },
    { value: 'intermediate', label: '중급' },
    { value: 'advanced', label: '고급' }
  ];

  return (
    <div className="settings-page">
      <div className="settings-section">
        <h2 className="settings-title">주기 설정</h2>
        <div className="settings-options">
          {intervals.map(interval => (
            <button
              key={interval.value}
              className={`settings-button ${Math.abs(settings.interval - interval.value) < 0.01 ? 'active' : ''}`}
              onClick={() => handleIntervalChange(interval.value)}
            >
              {interval.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-title">난이도 설정</h2>
        <div className="settings-options">
          {difficulties.map(diff => (
            <button
              key={diff.value}
              className={`settings-button ${settings.difficulty === diff.value ? 'active' : ''}`}
              onClick={() => handleDifficultyChange(diff.value as 'beginner' | 'intermediate' | 'advanced')}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
