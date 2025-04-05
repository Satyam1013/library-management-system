import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Link
            to="/books"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Books
          </Link>
          <Link
            to="/resources"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Digital Resources
          </Link>
          <Link
            to="/transactions"
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Transactions
          </Link>
        </div>
      </div>
  );
}
