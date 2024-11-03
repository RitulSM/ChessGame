import { useEffect, useState } from "react"

const WS_URL = "ws://localhost:8000"

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    ws.onopen = () => {
      setSocket(ws)
    }

    ws.onclose = () => {
      setSocket(null)
    }

    ws.onerror = (event) => {
      console.error("WebSocket error:", event)
      setSocket(null)
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [])

  return socket
}