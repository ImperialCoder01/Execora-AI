import Groq from 'groq-sdk';

export class GroqClient {
  private client: Groq | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY || '';
    this.model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    
    if (apiKey && apiKey.length > 5) {
      this.client = new Groq({ apiKey });
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.client);
  }

  public getModel(): string {
    return this.model;
  }

  public async complete(prompt: string, systemPrompt?: string, jsonMode: boolean = false): Promise<string> {
    if (!this.client) {
      throw new Error('GROQ_API_KEY is not configured on the server.');
    }

    try {
      const messages: any[] = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.1,
        response_format: jsonMode ? { type: 'json_object' } : undefined,
      });

      return response.choices[0]?.message?.content || '';
    } catch (err: any) {
      console.error(`[GroqClient] Completion error: ${err.message}`);
      throw err;
    }
  }
}
