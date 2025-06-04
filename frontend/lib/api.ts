// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// export class ApiClient {
//   private baseUrl: string;

//   constructor(baseUrl: string = API_BASE_URL) {
//     this.baseUrl = baseUrl;
//   }

//   private async request<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<T> {
//     const url = `${this.baseUrl}${endpoint}`;

//     const config: RequestInit = {
//       headers: {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//       ...options,
//     };

//     const response = await fetch(url, config);

//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status} ${response.statusText}`);
//     }

//     return response.json();
//   }

//   // Auth endpoints
//   async login() {
//     return this.request<{ authorization_url: string; state: string }>(
//       "/auth/login"
//     );
//   }

//   async refreshToken(userEmail: string) {
//     return this.request<{ access_token: string }>("/auth/refresh", {
//       method: "POST",
//       body: JSON.stringify({ user_email: userEmail }),
//     });
//   }

//   // Gmail endpoints
//   async getInbox(userEmail: string, maxResults = 50) {
//     return this.request<{ emails: any[] }>(
//       `/gmail/inbox/${userEmail}?max_results=${maxResults}`
//     );
//   }

//   // AI Agent endpoints
//   async generateAIResponse(emailRequest: {
//     user_email: string;
//     email_id: string;
//     thread_id: string;
//     email_content: string;
//   }) {
//     return this.request<{
//       response_id: string;
//       ai_response: string;
//       status: string;
//       draft_id: string | null;
//     }>("/agent/generate-response", {
//       method: "POST",
//       body: JSON.stringify(emailRequest),
//     });
//   }

//   async sendAIResponse(responseId: string, userEmail: string) {
//     return this.request<{ status: string; message_id: string }>(
//       "/agent/send-response",
//       {
//         method: "POST",
//         body: JSON.stringify({
//           response_id: responseId,
//           user_email: userEmail,
//         }),
//       }
//     );
//   }

//   async getAIResponses(userEmail: string, limit = 50) {
//     return this.request<{ responses: any[] }>(
//       `/agent/responses/${userEmail}?limit=${limit}`
//     );
//   }

//   // Pub/Sub endpoints
//   async setupGmailWatch(userEmail: string) {
//     return this.request<{ status: string; watch_response: any }>(
//       "/pubsub/setup-watch",
//       {
//         method: "POST",
//         body: JSON.stringify({ user_email: userEmail }),
//       }
//     );
//   }
// }

// export const apiClient = new ApiClient();
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ------------------- Auth -------------------
  async login() {
    return this.request<{ authorization_url: string; state: string }>(
      "/auth/login"
    );
  }

  async refreshToken(userEmail: string) {
    return this.request<{ access_token: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ user_email: userEmail }),
    });
  }

  // ------------------- Gmail -------------------
  async getInbox(userEmail: string, maxResults = 50) {
    return this.request<{ emails: any[] }>(
      `/gmail/inbox/${userEmail}?max_results=${maxResults}`
    );
  }

  // ------------------- AI Agent -------------------
  async generateAIResponse(emailRequest: {
    user_email: string;
    email_id: string;
    thread_id: string;
    email_content: string;
  }) {
    return this.request<{
      response_id: string;
      ai_response: string;
      status: string;
      draft_id: string | null;
    }>("/agent/generate-response", {
      method: "POST",
      body: JSON.stringify(emailRequest),
    });
  }

  async regenerateResponse(responseId: string) {
    return this.request<{ ai_response: string; status: string }>(
      `/agent/regenerate-response/${responseId}`,
      {
        method: "POST",
      }
    );
  }

  async sendAIResponse(responseId: string, userEmail: string) {
    return this.request<{ status: string; message_id: string }>(
      "/agent/send-response",
      {
        method: "POST",
        body: JSON.stringify({
          response_id: responseId,
          user_email: userEmail,
        }),
      }
    );
  }

  async getAIResponses(userEmail: string, limit = 50) {
    return this.request<{ responses: any[] }>(
      `/agent/responses/${userEmail}?limit=${limit}`
    );
  }

  async createDraft(responseId: string, userEmail: string) {
    return this.request<{ draft_id: string; status: string }>(
      "/agent/create-draft",
      {
        method: "POST",
        body: JSON.stringify({
          response_id: responseId,
          user_email: userEmail,
        }),
      }
    );
  }

  // ------------------- Automation -------------------
  async getAutomationSettings(userEmail: string) {
    return this.request<{ automation_enabled: boolean }>(
      `/automation/settings/${userEmail}`
    );
  }

  async updateAutomationSettings(userEmail: string, enabled: boolean) {
    return this.request<{ status: string }>("/automation/settings/update", {
      method: "POST",
      body: JSON.stringify({
        user_email: userEmail,
        automation_enabled: enabled,
      }),
    });
  }

  // ------------------- Pub/Sub -------------------
  async setupGmailWatch(userEmail: string) {
    return this.request<{ status: string; watch_response: any }>(
      "/pubsub/setup-watch",
      {
        method: "POST",
        body: JSON.stringify({ user_email: userEmail }),
      }
    );
  }
}

export const apiClient = new ApiClient();
