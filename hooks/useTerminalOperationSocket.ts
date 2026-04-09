import { useEffect, useRef, useState } from 'react';

import { env } from '../config/env.config';
import { tokenStorage } from '../lib/token-storage';

export type SocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WSEvent {
  event: string;
  topic: string;
  payload: any;
  timestamp: string;
}

interface UseTerminalOperationSocketOptions {
  operationId: string | null;
  onCheckoutCompleted?: (payload: any) => void;
  onCheckoutFailed?: (payload: any) => void;
  enabled?: boolean;
}

const HEARTBEAT_INTERVAL_MS = 10_000; // ping every 10s
const RECONNECT_DELAY_MS    = 2_000;  // wait 2s before reconnecting

export function useTerminalOperationSocket({
  operationId,
  onCheckoutCompleted,
  onCheckoutFailed,
  enabled = true,
}: UseTerminalOperationSocketOptions) {
  const [status, setStatus] = useState<SocketStatus>('disconnected');

  const wsRef           = useRef<WebSocket | null>(null);
  const heartbeatRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef      = useRef(true);
  const intentionalRef  = useRef(false); // true when we close on purpose

  const clearHeartbeat = () => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  };

  const clearReconnect = () => {
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
  };

  const startHeartbeat = (ws: WebSocket) => {
    clearHeartbeat();
    heartbeatRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event: 'ping' }));
      }
    }, HEARTBEAT_INTERVAL_MS);
  };

  const connect = async () => {
    if (!operationId || !enabled || !mountedRef.current) return;

    const token = await tokenStorage.get();
    if (!token) return;

    const apiBase = env.EXPO_PUBLIC_API_URL.replace(/^http/, 'ws');
    const topic   = `terminal-operation:checkout:status:${operationId}`;
    const url     = `${apiBase.replace('/api/v1', '')}/api/v1/ws?token=${encodeURIComponent(token)}&topic=${encodeURIComponent(topic)}`;

    // Close existing socket silently
    intentionalRef.current = true;
    wsRef.current?.close();
    intentionalRef.current = false;

    setStatus('connecting');
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setStatus('connected');
      startHeartbeat(ws);
    };

    ws.onmessage = (e) => {
      if (!mountedRef.current) return;
      try {
        const msg: WSEvent = JSON.parse(e.data);
        // pong keeps the connection alive — no UI update needed
        if (msg.event === 'pong') return;

        if (msg.event === 'checkout_completed' || msg.event === 'checkout_success') {
          onCheckoutCompleted?.(msg.payload);
        } else if (msg.event === 'checkout_failed' || msg.event === 'checkout_error') {
          onCheckoutFailed?.(msg.payload);
        }
      } catch {
        // malformed message — ignore
      }
    };

    ws.onerror = () => {
      if (!mountedRef.current) return;
      setStatus('error');
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      clearHeartbeat();

      // Only show disconnected + schedule reconnect if this wasn't intentional
      if (!intentionalRef.current) {
        setStatus('disconnected');
        if (enabled && operationId) {
          reconnectRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      }
    };
  };

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      intentionalRef.current = true;
      clearHeartbeat();
      clearReconnect();
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [operationId, enabled]);

  const disconnect = () => {
    intentionalRef.current = true;
    clearHeartbeat();
    clearReconnect();
    wsRef.current?.close();
    wsRef.current = null;
    setStatus('disconnected');
  };

  return { status, disconnect };
}
