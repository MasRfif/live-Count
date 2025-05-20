"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

type ViewerData = {
  time: string;
  viewers: number;
};

export default function LiveViewerDashboard() {
  const [data, setData] = useState<ViewerData[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:62024");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (msg) => {
      try {
        const message = JSON.parse(msg.data);
        const { event, data: eventData } = message;

        if (event === "viewers" && eventData?.viewerCount !== undefined) {
          const count = eventData.viewerCount;

          const newEntry = {
            time: new Date().toLocaleTimeString(),
            viewers: count,
          };

          setViewerCount(count);
          setData((prev) => {
            const updated = [...prev, newEntry];
            return updated.length > 20 ? updated.slice(-20) : updated;
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => console.log("WebSocket closed");
    ws.onerror = (err) => console.error("WebSocket error", err);

    return () => ws.close();
  }, []);

  return (
    <div className="items-center justify-center min-w-screen text-white p-6">
      <div className="flex-1 bg-gray-800 rounded-xl p-4 shadow ">
        <div className="text-4xl font-bold mb-2 text-turquoise-400">
          👁️ {viewerCount} Viewers
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="viewers"
              stroke="#00E0C6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
