import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Link } from "react-router-dom";
import axios from "axios";

const COLORS = ["#10B981", "#6366F1", "#FBBF24", "#EF4444", "#3B82F6"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    books: {
      total: 0,
      available: 0,
      reserved: 0,
      borrowed: 0,
      lost: 0,
    },
    ebooks: {
      total: 0,
      borrowed: 0,
    },
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

  const bookChartData = [
    { name: "Available", value: stats.books.available },
    { name: "Borrowed", value: stats.books.borrowed },
    { name: "Reserved", value: stats.books.reserved },
    { name: "Lost", value: stats.books.lost },
  ];

  const ebookChartData = [
    { name: "Borrowed Ebooks", value: stats.ebooks.borrowed },
    {
      name: "Unborrowed Ebooks",
      value: stats.ebooks.total - stats.ebooks.borrowed,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">
        📊 Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Chart */}
        <div className="bg-white shadow rounded-xl p-4 flex justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              📚 Book Distribution
            </h2>
            {loading ? (
              <p>Loading chart...</p>
            ) : (
              <PieChart width={300} height={300} className="mx-auto">
                <Pie
                  data={bookChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookChartData.map((entry, index) => (
                    <Cell
                      key={`book-cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </div>
        </div>

        {/* Ebook Chart */}
        <div className="bg-white shadow rounded-xl p-4 flex justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              💾 E-Book Distribution
            </h2>
            {loading ? (
              <p>Loading chart...</p>
            ) : (
              <PieChart width={300} height={300} className="mx-auto">
                <Pie
                  data={ebookChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ebookChartData.map((entry, index) => (
                    <Cell
                      key={`ebook-cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center">Quick Actions</h2>
        <div className="space-y-3">
          <Link
            to="/books"
            className="block px-6 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition"
          >
            📚 View Books
          </Link>
          <Link
            to="/resources"
            className="block px-6 py-3 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition"
          >
            💾 Digital Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
