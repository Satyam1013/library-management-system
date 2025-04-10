import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Link } from "react-router-dom";
import axios from "axios";

const COLORS = ["#10B981", "#6366F1", "#FBBF24", "#EF4444", "#3B82F6"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    books: 0,
    resources: 0,
    borrowed: 0,
    reserved: 0,
    available: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "Books", value: stats.books },
    { name: "Digital Resources", value: stats.resources },
    { name: "Borrowed", value: stats.borrowed },
    { name: "Reserved", value: stats.reserved },
    { name: "Available", value: stats.available },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        📊 Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4">Library Distribution</h2>

          {loading ? (
            <p>Loading chart...</p>
          ) : (
            <PieChart width={300} height={300}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </div>

        <div className="bg-white shadow rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/books"
              className="block px-4 py-2 bg-green-600 text-white text-center rounded hover:bg-green-700 transition"
            >
              📚 View Books
            </Link>
            <Link
              to="/resources"
              className="block px-4 py-2 bg-indigo-600 text-white text-center rounded hover:bg-indigo-700 transition"
            >
              💾 Digital Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
