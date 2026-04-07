const BEST_SCORE_KEY = "memoryGameBestScore";
const SETTINGS_KEY = "memoryGameSettings";

export function saveBestScore(score) {
  localStorage.setItem(BEST_SCORE_KEY, String(score));
}

export function loadBestScore() {
  const savedScore = localStorage.getItem(BEST_SCORE_KEY);

  if (savedScore === null) {
    return null;
  }

  return Number(savedScore);
}

export function savePlayerSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadPlayerSettings() {
  const savedSettings = localStorage.getItem(SETTINGS_KEY);

  if (!savedSettings) {
    return null;
  }

  return JSON.parse(savedSettings);
}