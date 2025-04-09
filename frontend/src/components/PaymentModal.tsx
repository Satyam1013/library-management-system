import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type PaymentMethod = "card" | "upi" | "netbanking";
type PaymentType = "available" | "borrowed" | "reserved" | "lost";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: PaymentType; // ✅ Add this line
}

export default function PaymentModal({
  isOpen,
  onClose,
  type,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const navigate = useNavigate();

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI field
  const [upiId, setUpiId] = useState("");

  // Net banking field
  const [selectedBank, setSelectedBank] = useState("");

  // Error state
  const [errors, setErrors] = useState<string[]>([]);

  const handlePay = () => {
    const newErrors: string[] = [];

    if (paymentMethod === "card") {
      if (!cardNumber.trim()) newErrors.push("Card number is required.");
      if (!cardName.trim()) newErrors.push("Name on card is required.");
      if (!expiry.trim()) newErrors.push("Expiry date is required.");
      if (!cvv.trim()) newErrors.push("CVV is required.");
    }

    if (paymentMethod === "upi") {
      if (!upiId.trim()) newErrors.push("UPI ID is required.");
    }

    if (paymentMethod === "netbanking") {
      if (!selectedBank) newErrors.push("Please select a bank.");
    }

    if (newErrors.length > 0) {
      newErrors.forEach((err) => toast.error(err));
      setErrors(newErrors);
      return;
    }

    // Simulate success
    toast.success("Payment Successful!");
    setErrors([]);
    onClose();
    navigate("/profile");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 space-y-4 animate-fade-in">
        <h2 className="text-xl font-bold text-center">Secure Payment</h2>
        <p className="text-center text-gray-600">
          Complete to borrow your book
        </p>

        <div className="flex justify-around border-b pb-2">
          {["card", "upi", "netbanking"].map((method) => (
            <button
              key={method}
              onClick={() => {
                setPaymentMethod(method as PaymentMethod);
                setErrors([]);
              }}
              className={`flex-1 text-sm font-medium py-2 ${
                paymentMethod === method
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {method === "card" && "💳 Card"}
              {method === "upi" && "🧾 UPI"}
              {method === "netbanking" && "🏦 Net Banking"}
            </button>
          ))}
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <ul className="text-red-500 text-sm space-y-1">
            {errors.map((err, index) => (
              <li key={index}>• {err}</li>
            ))}
          </ul>
        )}

        {paymentMethod === "card" && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Name on Card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-1/2 border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-1/2 border px-3 py-2 rounded"
              />
            </div>
          </div>
        )}

        {paymentMethod === "upi" && (
          <input
            type="text"
            placeholder="Enter UPI ID (e.g. name@bank)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        )}

        {paymentMethod === "netbanking" && (
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
          >
            <option value="">Select your bank</option>
            <option>State Bank of India</option>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>Axis Bank</option>
            <option>Kotak Bank</option>
          </select>
        )}

        <button
          onClick={handlePay}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-4"
        >
          Pay
        </button>
        <button
          onClick={onClose}
          className="w-full text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
