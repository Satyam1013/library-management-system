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
  const [previewResource, setPreviewResource] =
    useState<DigitalResource | null>(null);

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
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setPreviewResource(res)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Preview
              </button>
              <button
                onClick={() => handleBuy(res)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for PDF preview */}
      {previewResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded-lg p-4 relative">
            <h3 className="text-xl font-semibold mb-2">
              {previewResource.title} - Preview
            </h3>
            <embed
              src="/sample.pdf"
              type="application/pdf"
              className="w-full h-[500px] border rounded"
            />
            <button
              onClick={() => setPreviewResource(null)}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
