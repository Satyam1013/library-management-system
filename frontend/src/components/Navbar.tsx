export function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Library Management</h1>
        <div>
          <a
            href="/"
            className="text-white px-4 py-2 hover:bg-gray-700 rounded"
          >
            Home
          </a>
          <a
            href="/dashboard"
            className="text-white px-4 py-2 hover:bg-gray-700 rounded"
          >
            Dashboard
          </a>
          <a
            href="/books"
            className="text-white px-4 py-2 hover:bg-gray-700 rounded"
          >
            Books
          </a>
          <a
            href="/resources"
            className="text-white px-4 py-2 hover:bg-gray-700 rounded"
          >
            Digital Resources
          </a>
          <a
            href="/transactions"
            className="text-white px-4 py-2 hover:bg-gray-700 rounded"
          >
            Transactions
          </a>
        </div>
      </div>
    </nav>
  );
}
