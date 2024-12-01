interface RequestMetrics {
  startTime: number;
  endTime?: number;
  responseTime?: number;
  status?: number;
  size?: number;
  endpoint: string;
}

interface NetworkMetrics {
  responseTime: number;
  successRate: number;
  totalRequests: number;
  averageSize: number;
}

class NetworkMonitor {
  private requests: Map<string, RequestMetrics[]> = new Map();
  private metrics: Map<string, NetworkMetrics> = new Map();

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const startTime = performance.now();
      const url = typeof input === 'string' ? input : input.url;
      const endpoint = this.normalizeEndpoint(url);

      try {
        const response = await originalFetch(input, init);
        this.recordResponse(endpoint, startTime, response);
        return response;
      } catch (error) {
        this.recordError(endpoint, startTime);
        throw error;
      }
    };

    // XMLHttpRequest interceptor
    const XHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL) {
      const startTime = performance.now();
      const endpoint = this.normalizeEndpoint(url.toString());

      this.addEventListener('load', () => {
        this.recordResponse(endpoint, startTime, {
          status: this.status,
          size: parseInt(this.getResponseHeader('content-length') || '0', 10)
        });
      });

      this.addEventListener('error', () => {
        this.recordError(endpoint, startTime);
      });

      return XHROpen.apply(this, arguments as any);
    };
  }

  private normalizeEndpoint(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.pathname}${urlObj.search}`;
    } catch {
      return url;
    }
  }

  private recordResponse(endpoint: string, startTime: number, response: { status?: number; size?: number }) {
    const endTime = performance.now();
    const metrics: RequestMetrics = {
      startTime,
      endTime,
      responseTime: endTime - startTime,
      status: response.status,
      size: response.size,
      endpoint
    };

    if (!this.requests.has(endpoint)) {
      this.requests.set(endpoint, []);
    }
    this.requests.get(endpoint)!.push(metrics);

    this.updateMetrics(endpoint);
  }

  private recordError(endpoint: string, startTime: number) {
    this.recordResponse(endpoint, startTime, { status: 0 });
  }

  private updateMetrics(endpoint: string) {
    const requests = this.requests.get(endpoint) || [];
    const recentRequests = requests.slice(-100); // Consider only last 100 requests

    const metrics: NetworkMetrics = {
      responseTime: this.calculateAverageResponseTime(recentRequests),
      successRate: this.calculateSuccessRate(recentRequests),
      totalRequests: requests.length,
      averageSize: this.calculateAverageSize(recentRequests)
    };

    this.metrics.set(endpoint, metrics);
  }

  private calculateAverageResponseTime(requests: RequestMetrics[]): number {
    const validRequests = requests.filter(r => r.responseTime !== undefined);
    if (validRequests.length === 0) return 0;
    return validRequests.reduce((sum, r) => sum + (r.responseTime || 0), 0) / validRequests.length;
  }

  private calculateSuccessRate(requests: RequestMetrics[]): number {
    if (requests.length === 0) return 0;
    const successful = requests.filter(r => r.status && r.status >= 200 && r.status < 300).length;
    return (successful / requests.length) * 100;
  }

  private calculateAverageSize(requests: RequestMetrics[]): number {
    const validRequests = requests.filter(r => r.size !== undefined);
    if (validRequests.length === 0) return 0;
    return validRequests.reduce((sum, r) => sum + (r.size || 0), 0) / validRequests.length;
  }

  public getMetrics(): Map<string, NetworkMetrics> {
    return new Map(this.metrics);
  }

  public getRequestHistory(endpoint: string): RequestMetrics[] {
    return this.requests.get(endpoint) || [];
  }

  public clearHistory() {
    this.requests.clear();
    this.metrics.clear();
  }
}

export const networkMonitor = new NetworkMonitor();
