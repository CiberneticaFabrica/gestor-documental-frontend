import axiosInstance from '../axios-instance';

interface ChatbotResponse {
  query_id: string;
  question: string;
  answer: string;
  data_sources: string[];
  entities: {
    document_ids: string[];
    client_ids: string[];
    client_names: string[];
    document_types: string[];
    urgency_levels: string[];
  };
  intent: string;
  query_type: string;
  processing_time_ms: number;
  timestamp: string;
}

interface ChatbotRequest {
  question: string;
}

export const chatbotService = {
  /**
   * Envía una pregunta al chatbot global
   * @param question La pregunta a enviar
   * @returns La respuesta del chatbot
   */
  askQuestion: async (question: string): Promise<ChatbotResponse> => {
    const request: ChatbotRequest = { question };
    const response = await axiosInstance.post<ChatbotResponse>('/chat/global', request);
    return response.data;
  }
}; 