export interface Option {
    text: string;
    is_correct: boolean;
  }
  
  export interface Question {
    descr: string;
    type: "choose";
    options: Option[];
  }
  
  export interface QuestBody {
    allow_changing_answers: boolean;
    allow_switching_questions: boolean;
    randomize_questions: boolean;
    questions: Record<string, Question>;
  }
  
  export interface CreateQuestRequest {
    name: string;
    desc?: string;
    quest_body: QuestBody[];
    max_players: number;
    max_attempts: number;
  }
  
  export interface Quest {
    id: number;
    name: string;
    desc: string;
    quest_body: QuestBody;
    max_players: number;
    max_attempts: number;
    created_at: string;
  }