import { CreditCardIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Dispatch,
  MouseEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
// import StripeCheckout from "react-stripe-checkout";
import { PaymentIntentResult } from "@stripe/stripe-js";
import axios from "axios";
import Cookies from "js-cookie";
import { CartProduct } from "../typings";
import baseUrl from "../utils/baseUrl";
import calculateTotal from "../utils/calculateTotal";
import catchErrors from "../utils/catchErrors";
import { DotSpinner } from "@uiball/loaders";
import toast from "react-hot-toast";
import scrollToRef from "../utils/scrollToRef";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";

interface Props {
  products: CartProduct[];
  setSuccess: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string>>;
  success: boolean;
}

const CartSummary = ({ products, success, setSuccess, setMessage }: Props) => {
  const user = useRecoilValue(userState);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [cartAmt, setCartAmt] = useState<string>("");
  const [stripeAmt, setStripeAmt] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmpty, setEmpty] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const paymentRef = useRef<HTMLHRElement>(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateTotal(products);

    setCartAmt(cartTotal);
    setStripeAmt(stripeTotal);
    setEmpty(products.length === 0);
  }, [products]);

  // opens the PaymentElement and scrolls to element
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (open) {
      timeout = setTimeout(() => scrollToRef(paymentRef), 500);
    }
    return () => clearTimeout(timeout);
  }, [open, paymentRef]);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: PaymentIntentResult) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            return setMessage("Payment succeeded!");
          case "processing":
            return setMessage("Your payment is processing");
          case "requires_payment_method":
            return setMessage(
              "Your payment was not successful, please try again."
            );
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
  }, [stripe]);

  async function handleCheckout(
    e: MouseEvent<HTMLFormElement, globalThis.MouseEvent>
  ) {
    e.preventDefault();
    if (!stripe || !elements) return;
    let paymentData = {
      products,
      email: user?.email,
      id: user?._id
    };
    setLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: baseUrl!,
        },
      });

      if (!error) {
        const url = `${baseUrl}/api/checkout`;
        const token = Cookies.get("token")!;
        const payload = { paymentData };
        const headers = { headers: { Authorization: token } };
        await axios.post(url, payload, headers);
        setSuccess(true);
      }
    } catch (error) {
      catchErrors(error, setErrorMsg);
      toast.error(errorMsg ? errorMsg : "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="border-2 rounded-md flex justify-between">
        <div className="p-5">
          <h3 className="font-semibold sm:text-lg">
            Sub total: <span>${cartAmt}</span>
          </h3>
        </div>
        <div className="flex flex-col justify-center p-5">
          <button
            onClick={() => setOpen(!open)}
            className="readyBtn whitespace-nowrap">
            <CreditCardIcon className="h-5 w-5" />
            Ready?
          </button>
        </div>
      </section>
      <hr
        className={`${!open ? "border-gray-50" : "border-gray-300"} mx-1 my-5`}
      />
      {open && (
        <form onSubmit={handleCheckout}>
          <PaymentElement
            id="payment-element"
            className="p-5 border-2 border-b-0 rounded-t-md"
          />
          <div className="flex justify-end px-5 pb-5 border-2 border-t-0 rounded-md">
            <button
              type="submit"
              disabled={isEmpty || success}
              className="checkoutBtn">
              <ShoppingCartIcon className="h-5 w-5" />
              Checkout
              {loading && (
                <div className="absolute left-14">
                  <DotSpinner size={30} speed={0.9} color="black" />
                </div>
              )}
            </button>
          </div>
        </form>
      )}
      <hr ref={paymentRef} className="border-gray-50" />
    </>
  );
};

export default CartSummary;
