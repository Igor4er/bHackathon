import { CreateQuestRequest, Quest } from "@/@types/quest";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/quests",
  headers: { Accept: "application/json" },
});



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

export const getQuest = async (quest_id: number): Promise<Quest> => {
  try {
    const { data } = await api.get<Quest>(`/get/${quest_id}`);
    return data;
  } catch (error: unknown) {
    let message = "Failed to get quest";
    if (axios.isAxiosError(error)) {
      message += `: ${error.response?.data?.detail || error.message}`;
    }
    console.error(message);
    throw new Error(message);
  }
};

export const getQuests = async (): Promise<Quest[]> => {
  try {
    const { data } = await api.get<Quest[]>(`/get/`);
    return data;
  } catch (error: unknown) {
    let message = "Failed to get quests";
    if (axios.isAxiosError(error)) {
      message += `: ${error.response?.data?.detail || error.message}`;
    }
    console.error(message);
    throw new Error(message);
  }
};

export const deleteQuest = async (quest_id: number): Promise<string> => {
  try {
    const { data } = await api.delete<string>(`/delete/${quest_id}`);
    return data;
  } catch (error: unknown) {
    let message = "Failed to delete quest";
    if (axios.isAxiosError(error)) {
      message += `: ${error.response?.data?.detail || error.message}`;
    }
    console.error(message);
    throw new Error(message);
  }
};