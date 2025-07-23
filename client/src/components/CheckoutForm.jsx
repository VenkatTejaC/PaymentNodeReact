import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) * 100 }),
      });

      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("✅ Payment successful!");
        setAmount("");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-white">
      <form
  onSubmit={handleSubmit}
  style={{
    border: "6px solid white",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    paddingLeft: "3rem",
    paddingRight: "3rem",
    borderRadius: "3rem",
    backgroundColor: "white",
    color: "black",
  }}
>

        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Send Money Safe
        </h2>

        <div className="flex flex-col mb-6">
          <label className="text-black font-bold text-lg mb-2">Amount ($)</label><br></br>
          <input
            type="number"
            placeholder=""
            className="w-full px-5 py-4 rounded-lg border border-white bg-transparent text-black placeholder-black placeholder-opacity-70 italic focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <br></br>
        <div className="flex flex-col mb-6">
          <label className="text-black font-bold text-lg mb-4">Card Details</label>

          <div className="flex flex-col gap-4">
            <div className="p-3 rounded-lg border border-gray-300 bg-white">
              <CardNumberElement
                options={{
                  placeholder: "Enter your card number",
                  style: {
                    base: {
                      color: "#070707",
                      fontSize: "16px",
                      "::placeholder": {
                        color: "#cccccc",
                      },
                    },
                    invalid: {
                      color: "#ff6b6b",
                    },
                  },
                }}
              />
            </div>

            <div className="p-3 rounded-lg border border-gray-300 bg-white">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      color: "#070707",
                      fontSize: "16px",
                      "::placeholder": {
                        color: "#cccccc",
                      },
                    },
                    invalid: {
                      color: "#ff6b6b",
                    },
                    valid: {
                      color: "#70ff6b",
                    },
                  },
                }}
              />
            </div>

            <div className="p-3 rounded-lg border border-gray-300 bg-white">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      color: "#070707",
                      fontSize: "16px",
                      "::placeholder": {
                        color: "#cccccc",
                      },
                    },
                    invalid: {
                      color: "#ff6b6b",
                    },
                    valid: {
                      color: "#70ff6b",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <br></br>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 mt-6"
        >
          {loading ? "Processing..." : "Send Now"}
        </button>

        {message && (
          <p className="text-center text-sm text-red-600 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
}