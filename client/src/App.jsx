import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm";

const stripePromise = loadStripe("pk_test_51Rla5hQvFKJdaTzvoiTnNYQveqZjVbZwMtaXyvaIbherD1uwcWJ8g5L5cRELuXHN5qXjG5x7V2myyxzVwZ0Iy0Y600AvPhw13g");

function App() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default App;
