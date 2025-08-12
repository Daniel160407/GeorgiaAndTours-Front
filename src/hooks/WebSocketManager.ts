type ConnectionListenerType = 'open' | 'close' | 'error';

interface WebSocketMessage {
  [key: string]: unknown;
}

export default class WebSocketManager {
  private url: string;
  private socket: WebSocket | null = null;
  private messageHandlers: Set<(message: WebSocketMessage) => void> = new Set();
  private connectionListeners: Record<ConnectionListenerType, Set<(event: Event | CloseEvent | ErrorEvent) => void>> = {
    open: new Set(),
    close: new Set(),
    error: new Set(),
  };
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private autoReconnect = true;

  constructor(endpoint: string) {
    const API_SOCKET_URL = import.meta.env.VITE_API_SOCKET_URL as string;
    this.url = `${API_SOCKET_URL}${endpoint}`;
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.warn('WebSocket is already connected or connecting');
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = (event: Event) => {
      this.reconnectAttempts = 0;
      this.connectionListeners.open.forEach(listener => listener(event));
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.socket.onclose = (event: CloseEvent) => {
      this.connectionListeners.close.forEach(listener => listener(event));
      if (this.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          this.connect();
        }, this.reconnectInterval);
      }
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
      this.connectionListeners.error.forEach(listener => listener(error));
    };
  }

  public send(message: WebSocketMessage | string): void {
    if (this.isConnected()) {
      const payload = typeof message === 'string' ? message : JSON.stringify(message);
      this.socket?.send(payload);
    } else {
      console.error('Cannot send message - WebSocket not connected');
    }
  }

  public addMessageHandler(handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers.add(handler);
  }

  public removeMessageHandler(handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers.delete(handler);
  }

  public addConnectionListener(type: ConnectionListenerType, handler: (event: Event | CloseEvent | ErrorEvent) => void): void {
    if (this.connectionListeners[type]) {
      this.connectionListeners[type].add(handler);
    }
  }

  public removeConnectionListener(type: ConnectionListenerType, handler: (event: Event | CloseEvent | ErrorEvent) => void): void {
    if (this.connectionListeners[type]) {
      this.connectionListeners[type].delete(handler);
    }
  }

  public isConnected(): boolean {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  public disconnect(): void {
    this.autoReconnect = false;
    if (this.socket) {
      this.socket.close();
    }
  }

  public reconnect(): void {
    this.disconnect();
    this.autoReconnect = true;
    this.connect();
  }
}
