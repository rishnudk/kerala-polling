"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface ResultData {
  party:      string;
  votes:      number;
  percentage: number;
  color:      string;
}

interface Props {
  data:  ResultData[];
  total: number;
}

// Custom tooltip shown on hover
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ResultData;
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg px-3 py-2
                 shadow-sm text-sm"
    >
      <p className="font-semibold text-gray-800">{d.party}</p>
      <p className="text-gray-500">
        {d.votes} vote{d.votes !== 1 ? "s" : ""} · {d.percentage}%
      </p>
    </div>
  );
}

export function ResultsChart({ data, total }: Props) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400">
        No votes recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
          barCategoryGap="28%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#F3F4F6"
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="party"
            width={40}
            tick={{ fontSize: 13, fontWeight: 600, fill: "#374151" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
          <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
            {data.map((entry) => (
              <Cell key={entry.party} fill={entry.color} />
            ))}
            <LabelList
              dataKey="percentage"
              position="right"
              formatter={(v: any) => `${v}%`}
              style={{ fontSize: 12, fontWeight: 600, fill: "#6B7280" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Vote count breakdown below chart */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((d) => (
          <div
            key={d.party}
            className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <div>
              <p className="text-xs font-semibold text-gray-700">{d.party}</p>
              <p className="text-xs text-gray-400">
                {d.votes} vote{d.votes !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        {total} total response{total !== 1 ? "s" : ""} in this poll
      </p>
    </div>
  );
}