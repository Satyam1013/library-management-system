import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  actionType: "borrow" | "renew" | "lost";
}

interface DecodedToken {
  role: string;
  sub: string;
  exp: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  actionType,
}: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
        } else {
          setRole(decoded.role);
        }
      } catch (err) {
        setRole(null);
      }
    }
  }, []);

  const getTitle = () => {
    if (role === "librarian") {
      switch (actionType) {
        case "lost":
          return "Confirm Mark as Lost";
        case "renew":
          return "Confirm Renewal";
        case "borrow":
        default:
          return "Confirm Borrowing";
      }
    } else {
      switch (actionType) {
        case "lost":
          return "Lost Book Payment";
        case "renew":
          return "Renew Your Book";
        case "borrow":
        default:
          return "Secure Card Payment";
      }
    }
  };

  const getSubtitle = () => {
    if (role === "librarian") {
      switch (actionType) {
        case "lost":
          return "Confirm to mark the book as lost";
        case "renew":
          return "Confirm to renew the book";
        case "borrow":
        default:
          return "Confirm to proceed with borrowing";
      }
    } else {
      switch (actionType) {
        case "lost":
          return "Pay to mark your book as lost";
        case "renew":
          return "Complete to renew your book";
        case "borrow":
        default:
          return "Complete to borrow your book";
      }
    }
  };

  const handlePay = () => {
    // Skip validation if librarian (except lost)
    if (role !== "librarian") {
      const newErrors: Record<string, string> = {};
      if (!cardNumber.trim()) newErrors.cardNumber = "Card number is required.";
      if (!cardName.trim()) newErrors.cardName = "Name on card is required.";
      if (!expiry.trim()) newErrors.expiry = "Expiry date is required.";
      if (!cvv.trim()) newErrors.cvv = "CVV is required.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Payment Successful!");
      onClose();
      onSuccess?.();
      navigate("/profile");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 space-y-4 animate-fade-in">
        <h2 className="text-xl font-bold text-center">{getTitle()}</h2>
        <p className="text-center text-gray-600">{getSubtitle()}</p>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : role === "librarian" && actionType !== "lost" ? (
          <>
            <button
              onClick={handlePay}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {/* Payment Form */}
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
