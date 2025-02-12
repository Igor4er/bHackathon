import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/quests",
  headers: { Accept: "application/json" },
});

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

export const createQuest = async (
  quest: CreateQuestRequest
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const { data } = await api.post("/create", quest, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    return data;
  } catch (error: unknown) {
    let message = "Failed to create quest";
    if (axios.isAxiosError(error)) {
      message += `: ${error.response?.data?.detail || error.message}`;
    }
    console.error(message);
    throw new Error(message);
  }
};