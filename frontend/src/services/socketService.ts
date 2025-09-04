import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(userId: string) {
    if (this.socket) {
      this.disconnect();
    }

    const SUBMISSION_SERVICE_URL = (import.meta as any).env.PROD
      ? "wss://13.203.186.121:3003" // Use WSS for production
      : ((import.meta as any).env.VITE_SUBMISSION_SERVICE_URL || "http://13.203.186.121:3003");

    this.socket = io(SUBMISSION_SERVICE_URL, {
      transports: ["websocket", "polling"],
      secure: (import.meta as any).env.PROD, // Enable secure connection in production
    });

    this.socket.on("connect", () => {
      console.log("Connected to submission service via WebSocket");
      this.isConnected = true;

      // Join user-specific room for receiving updates
      this.socket?.emit("join-user-room", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from submission service");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    return this.socket;
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
