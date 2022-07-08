import { CreditCardIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import {
  CardElement,
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
import stripeSuccessMethodHandler from "../utils/stripeSuccessMethodHandler";

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
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
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

    console.log("useEffect client", clientSecret)
    console.log("success", success)

    if (!clientSecret) return;

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: PaymentIntentResult) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            return stripeSuccessMethodHandler(paymentIntent, setMessage, setSuccess, user);
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

    setLoading(true);

    try {
      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${baseUrl}/cart`,
          shipping: {
            name: user?.name || "Not provided",
            address: {
              line1: street,
              city: city,
              postal_code: zipcode,
            },
          },
          receipt_email: user?.email,
          payment_method_data: {
            billing_details: {
              address: {
                line1: street,
                city: city,
                postal_code: zipcode,
              },
              name: user?.name,
              email: user?.email,
            }
          },
        },
      })

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
            disabled={success}
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
            className="px-5 pt-5 pb-3 border-2 border-b-0 rounded-t-md"
          />
          
          <div className="px-5 border-x-2 flex flex-col">
            <p className="font-semibold text-lg pb-1">Shipping Address</p>
            <label className="text-gray-700" htmlFor="street">
              Street Address
            </label>
            <input
              onChange={(e) => setStreet(e.target.value)}
              value={street}
              className="placeholder:text-gray-500 placeholder:text-[17px] rounded-md mt-0.5 border-2 py-2 px-3 focus:ring-[3px] focus:ring-blue-200 outline-none"
              type="text"
              name="street"
              placeholder="Street"
            />
            <div className="grid grid-cols-2 gap-[11px]">
              <label
                className="text-gray-700 pt-3 flex flex-col"
                htmlFor="city">
                City
                <input
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  className="placeholder:text-gray-500 placeholder:text-[17px] rounded-md mt-0.5 border-2 py-2 px-3 focus:ring-[3px] focus:ring-blue-200 outline-none"
                  type="text"
                  name="city"
                  placeholder="City"
                />
              </label>
              <label
                className="text-gray-700 pt-3 flex flex-col"
                htmlFor="zipcode">
                Zip Code
                <input
                  onChange={(e) => setZipcode(e.target.value)}
                  value={zipcode}
                  className="placeholder:text-gray-500 placeholder:text-[17px] rounded-md mt-0.5 border-2 py-2 px-3 focus:ring-[3px] focus:ring-blue-200 outline-none"
                  type="text"
                  name="zipcode "
                  placeholder="Zip Code"
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end px-5 py-5 border-2 border-t-0 rounded-md">
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
