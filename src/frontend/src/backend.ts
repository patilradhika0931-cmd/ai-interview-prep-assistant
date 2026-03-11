import { Actor, type ActorConfig } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import type { HttpAgent } from "@icp-sdk/core/agent";

// ---- Candid Types ----

export interface Question {
  id: bigint;
  role: string;
  topic: string;
  difficulty: string;
  text: string;
}

export interface AnswerFeedback {
  score: bigint;
  feedback: string;
  suggestions: string;
}

export interface SessionAnswer {
  answer: string;
  feedback: [] | [AnswerFeedback];
}

export interface InterviewSession {
  id: bigint;
  role: string;
  questions: string[];
  answers: SessionAnswer[];
  status: string;
  createdAt: bigint;
  overallScore: [] | [bigint];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ResumeAnalysis {
  id: bigint;
  skills: string[];
  questions: string[];
  createdAt: bigint;
}

export interface backendInterface {
  createInterviewSession(role: string): Promise<bigint>;
  getSession(sessionId: bigint): Promise<[] | [InterviewSession]>;
  submitAnswer(sessionId: bigint, questionIndex: bigint, answer: string): Promise<[] | [AnswerFeedback]>;
  completeSession(sessionId: bigint): Promise<[] | [InterviewSession]>;
  getQuestions(role: string, topic: string, difficulty: string): Promise<Question[]>;
  saveResumeAnalysis(skills: string[]): Promise<bigint>;
  getResumeAnalysis(analysisId: bigint): Promise<[] | [ResumeAnalysis]>;
  getPerformanceHistory(): Promise<InterviewSession[]>;
  getAllSessions(): Promise<InterviewSession[]>;
}

// ---- IDL Factory ----

const AnswerFeedbackIDL = IDL.Record({
  score: IDL.Nat,
  feedback: IDL.Text,
  suggestions: IDL.Text,
});

const SessionAnswerIDL = IDL.Record({
  answer: IDL.Text,
  feedback: IDL.Opt(AnswerFeedbackIDL),
});

const InterviewSessionIDL = IDL.Record({
  id: IDL.Nat,
  role: IDL.Text,
  questions: IDL.Vec(IDL.Text),
  answers: IDL.Vec(SessionAnswerIDL),
  status: IDL.Text,
  createdAt: IDL.Int,
  overallScore: IDL.Opt(IDL.Nat),
  strengths: IDL.Vec(IDL.Text),
  weaknesses: IDL.Vec(IDL.Text),
  suggestions: IDL.Vec(IDL.Text),
});

const QuestionIDL = IDL.Record({
  id: IDL.Nat,
  role: IDL.Text,
  topic: IDL.Text,
  difficulty: IDL.Text,
  text: IDL.Text,
});

const ResumeAnalysisIDL = IDL.Record({
  id: IDL.Nat,
  skills: IDL.Vec(IDL.Text),
  questions: IDL.Vec(IDL.Text),
  createdAt: IDL.Int,
});

export const idlFactory = ({ IDL: _IDL }: { IDL: typeof IDL }) => {
  return _IDL.Service({
    createInterviewSession: _IDL.Func([_IDL.Text], [_IDL.Nat], []),
    getSession: _IDL.Func([_IDL.Nat], [_IDL.Opt(InterviewSessionIDL)], ["query"]),
    submitAnswer: _IDL.Func([_IDL.Nat, _IDL.Nat, _IDL.Text], [_IDL.Opt(AnswerFeedbackIDL)], []),
    completeSession: _IDL.Func([_IDL.Nat], [_IDL.Opt(InterviewSessionIDL)], []),
    getQuestions: _IDL.Func([_IDL.Text, _IDL.Text, _IDL.Text], [_IDL.Vec(QuestionIDL)], ["query"]),
    saveResumeAnalysis: _IDL.Func([_IDL.Vec(_IDL.Text)], [_IDL.Nat], []),
    getResumeAnalysis: _IDL.Func([_IDL.Nat], [_IDL.Opt(ResumeAnalysisIDL)], ["query"]),
    getPerformanceHistory: _IDL.Func([], [_IDL.Vec(InterviewSessionIDL)], ["query"]),
    getAllSessions: _IDL.Func([], [_IDL.Vec(InterviewSessionIDL)], ["query"]),
  });
};

// ---- ExternalBlob ----

export class ExternalBlob {
  private _bytes?: Uint8Array;
  private _url?: string;
  public onProgress?: (progress: number) => void;

  static fromBytes(bytes: Uint8Array): ExternalBlob {
    const blob = new ExternalBlob();
    blob._bytes = bytes;
    return blob;
  }

  static fromURL(url: string): ExternalBlob {
    const blob = new ExternalBlob();
    blob._url = url;
    return blob;
  }

  async getBytes(): Promise<Uint8Array> {
    if (this._bytes) return this._bytes;
    if (this._url) {
      const res = await fetch(this._url);
      const buf = await res.arrayBuffer();
      return new Uint8Array(buf);
    }
    return new Uint8Array();
  }

  getURL(): string | undefined {
    return this._url;
  }
}

// ---- CreateActor ----

export type CreateActorOptions = {
  agentOptions?: Record<string, unknown>;
  actorOptions?: ActorConfig;
  agent?: HttpAgent;
  processError?: (e: unknown) => never;
};

export function createActor(
  canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  options?: CreateActorOptions,
): backendInterface {
  const actor = Actor.createActor<backendInterface>(idlFactory as never, {
    agent: options?.agent as never,
    canisterId,
    ...options?.actorOptions,
  }) as backendInterface;
  return actor;
}
