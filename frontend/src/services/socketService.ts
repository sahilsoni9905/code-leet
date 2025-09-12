import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(userId: string) {
    if (this.socket) {
      this.disconnect();
    }

    // For now, disable WebSocket to avoid mixed content errors
    // TODO: Configure backend for WSS support
    console.log("WebSocket connection disabled due to SSL requirements");
    this.isConnected = false;
    return null;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  onSubmissionUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("submission-updated", callback);
    }
  }

  offSubmissionUpdate(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off("submission-updated", callback);
      } else {
        this.socket.off("submission-updated");
      }
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
