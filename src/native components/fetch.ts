interface RequestBody {
  method: string;
  headers: { [key: string]: string };
  body?: string;
}

export class Fetch {
  constructor(private readonly baseUrl: string) {}

  get url(): string {
    return this.baseUrl;
  }

  async request(
    extension: string,
    method: string,
    body?: any,
    headers: any = {},
  ): Promise<any> {
    const requestData: RequestBody = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (method !== 'GET') {
      requestData.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.url}${extension}`, requestData);

    if (!response.ok) {
      throw {
        status: response.status,
        data: response.statusText,
        response,
        successful: response.ok,
      };
    }

    return {
      status: response.status,
      data: await response.json(),
      response,
      successful: response.ok,
    };
  }

  async get(extension: string, headers?: any): Promise<any> {
    return await this.request(extension, 'GET', {}, headers);
  }

  async post(extension: string, body?: any, headers?: any): Promise<any> {
    return await this.request(extension, 'POST', body, headers);
  }
}
