import { useEffect, useState } from "react";
import axios from "axios";

interface DigitalResource {
  _id?: string;
  resourceId: string;
  title: string;
  author: string;
  category: string;
  fileUrl: string;
  cost: number;
}

export default function DigitalResources() {
  const [resources, setResources] = useState<DigitalResource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/digital-resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(res.data);
    };

    fetchResources();
  }, []);

  const handleBuy = (resource: DigitalResource) => {
    // Replace with your actual payment logic
    alert(`Buying "${resource.title}" for $${resource.cost}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-semibold">Digital Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {resources.map((res) => (
          <div
            key={res._id}
            className="border p-4 rounded shadow flex flex-col justify-between"
          >
            <div>
              <p className="font-bold text-lg">{res.title}</p>
              <p className="text-sm">{res.author}</p>
              <p className="text-sm">{res.category}</p>
              <p className="text-sm text-gray-500">Cost: ${res.cost}</p>
            </div>
            <button
              onClick={() => handleBuy(res)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
