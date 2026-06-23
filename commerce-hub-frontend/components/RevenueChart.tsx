"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RevenueChart({
  data,
}: {
  data: any[];
}) {
  return (
    <div
      className="
      bg-zinc-900
      rounded-3xl
      p-6
      border
      border-zinc-800
      "
    >
      <h2 className="text-2xl font-bold mb-6">
        Revenue Analytics
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              strokeWidth={3}
              
            />

          </LineChart>

        </ResponsiveContainer>

      </div>
    </div>
  );
}