export interface GmailCredentials {
  access_token: string
  refresh_token: string
  scope: string
  token_type: string
  expiry_date: number
}

export class GmailHelper {
  private credentials: GmailCredentials | null = null

  constructor() {
    this.loadCredentials()
  }

  private loadCredentials() {
    const stored = localStorage.getItem("gmail_credentials")
    if (stored) {
      this.credentials = JSON.parse(stored)
    }
  }

  saveCredentials(credentials: GmailCredentials) {
    this.credentials = credentials
    localStorage.setItem("gmail_credentials", JSON.stringify(credentials))
  }

  getCredentials(): GmailCredentials | null {
    return this.credentials
  }

  isAuthenticated(): boolean {
    return this.credentials !== null && !this.isTokenExpired()
  }

  private isTokenExpired(): boolean {
    if (!this.credentials) return true
    return Date.now() >= this.credentials.expiry_date
  }

  async refreshTokenIfNeeded(userEmail: string): Promise<boolean> {
    if (!this.isTokenExpired()) return true

    try {
      const { apiClient } = await import("./api")
      const response = await apiClient.refreshToken(userEmail)

      if (this.credentials) {
        this.credentials.access_token = response.access_token
        this.credentials.expiry_date = Date.now() + 3600 * 1000 // 1 hour
        this.saveCredentials(this.credentials)
      }

      return true
    } catch (error) {
      console.error("Failed to refresh token:", error)
      this.clearCredentials()
      return false
    }
  }

  clearCredentials() {
    this.credentials = null
    localStorage.removeItem("gmail_credentials")
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.credentials) {
      throw new Error("No credentials available")
    }

    return {
      Authorization: `Bearer ${this.credentials.access_token}`,
    }
  }
}

export const gmailHelper = new GmailHelper()
