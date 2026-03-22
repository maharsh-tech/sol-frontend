const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Analyse a meeting.
 * Pass either an audio File object OR a transcript string (not both).
 * Returns: { transcript, summary, actionItems, keyDecisions }
 */
export async function analyzeMeeting({ audio, transcript }) {
  const formData = new FormData();
  if (audio) {
    formData.append('audio', audio);
  }
  if (transcript) {
    formData.append('transcript', transcript);
  }

  const response = await fetch(`${BASE_URL}/meeting/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(error.detail || 'Analysis failed');
  }
  return response.json();
}

/**
 * Post a meeting analysis to Slack.
 * @param {{ summary: string, actionItems: Array, keyDecisions: Array }} data
 */
export async function postMeetingToSlack(data) {
  const response = await fetch(`${BASE_URL}/meeting/slack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Slack post failed' }));
    throw new Error(error.detail || 'Slack post failed');
  }
  return response.json();
}
