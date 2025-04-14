import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePay = () => {
    const newErrors: Record<string, string> = {};

    if (!cardNumber.trim()) newErrors.cardNumber = "Card number is required.";
    if (!cardName.trim()) newErrors.cardName = "Name on card is required.";
    if (!expiry.trim()) newErrors.expiry = "Expiry date is required.";
    if (!cvv.trim()) newErrors.cvv = "CVV is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulate delay before redirect
    setTimeout(() => {
      setLoading(false);
      toast.success("Payment Successful!");
      setErrors({});
      onClose();
      onSuccess?.();
      navigate("/profile");
    }, 2000); // 2 seconds
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 space-y-4 animate-fade-in">
        <h2 className="text-xl font-bold text-center">Secure Card Payment</h2>
        <p className="text-center text-gray-600">
          Complete to borrow your book
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Card Fields */}
            <div className="space-y-2">
              <div>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Name on Card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.cardName && (
                  <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                  {errors.expiry && (
                    <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                  {errors.cvv && (
                    <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>

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
          </>
        )}
      </div>
    </div>
  );
}
