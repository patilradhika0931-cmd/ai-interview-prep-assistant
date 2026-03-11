# AI Interview Preparation Assistant

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Home page with hero section, CTA buttons, feature cards
- AI Mock Interview: select job role, chat-style Q&A interface, one question at a time
- AI Answer Feedback: scoring on correctness, communication quality, suggestions
- Resume Analyzer: upload PDF, extract skills, generate personalized questions
- Smart Question Generator: filter by role, topic, difficulty
- Performance Dashboard: scores, strengths/weaknesses, progress bars, charts
- Dark/light mode toggle
- Navigation bar with all sections
- Smooth animations and responsive design

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- Store interview sessions with questions, answers, scores
- Store generated questions by role/topic/difficulty
- Store resume analysis results (skills, generated questions)
- Store performance history per user (scores, strengths, weaknesses)
- APIs: createSession, submitAnswer, getSessionResults, generateQuestions, analyzeResume, getPerformanceHistory

### Frontend (React + TypeScript)
- Navigation bar with links to all sections + dark/light mode toggle
- Home: hero section with gradient, feature cards, CTAs
- Mock Interview: role selector, chat interface, question display, answer input
- Resume Analyzer: PDF upload dropzone, skill chips, personalized questions list
- Practice Questions: filters (role, topic, difficulty), question cards
- Dashboard: score overview, bar/progress charts, strengths/weaknesses lists
- Simulated AI feedback logic on frontend using question banks and scoring rules
- Responsive layout for mobile and desktop
