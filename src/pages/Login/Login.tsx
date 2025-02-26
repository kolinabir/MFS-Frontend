/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";
import { AuthContext, AuthContextProps } from "../../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function Login() {
  const { user, signIn } = useContext(AuthContext) as AuthContextProps;
  const { toast } = useToast();
  const navigate = useNavigate();
  if (user) {
    navigate("/dashboard");
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  console.log(user);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let mobileNumber = 0;
    let email = "";
    const form = e.currentTarget;
    const emailOrMBNo = form.elements.namedItem(
      "emailOrMBNo"
    ) as HTMLInputElement;
    const pinInput = form.elements.namedItem("pin") as HTMLInputElement;
    // check if emailOrMBNo is a number or email
    if (isNaN(Number(emailOrMBNo.value))) {
      email = emailOrMBNo.value;
    } else {
      mobileNumber = Number(emailOrMBNo.value);
    }

    const pin = pinInput.value;

    try {
      setLoading(true);
      if (email) {
        console.log(email, pin);
        const data = await signIn(String(email), String(pin));
        console.log(data);
        toast({
          title: "Login successful",
          description: "You have successfully logged in",
        });
      } else if (mobileNumber) {
        console.log(mobileNumber, pin);
        const data = await signIn(Number(mobileNumber), String(pin));
        console.log(data);
        toast({
          title: "Login successful",
          description: "You have successfully logged in",
        });
      }

      // Use navigate to redirect after successful login
      // navigate(location?.state ? location.state : "/");
    } catch (error: any) {
      setError(true);
      console.error(error);
      toast({
        title: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center rounded-xl bg-white py-12 md:px-32 shadow-lg">
        <h4 className="text-3xl font-semibold text-indigo-600 mb-2">Login</h4>
        <p className="text-base text-gray-700 mb-6">
          Enter your details to login.
        </p>
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <div className="mb-4">
            <label
              className="block text-sm font-normal text-blue-gray-700 mb-2"
              htmlFor="emailOrMBNo"
            >
              Email or Mobile Number
            </label>
            <input
              className="w-full rounded-md border border-blue-gray-200 bg-transparent  py-2 text-lg text-blue-gray-700 placeholder-blue-gray-500 focus:border-pink-500 focus:outline-none"
              type="text"
              name="emailOrMBNo"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-normal text-blue-gray-700 mb-2"
              htmlFor="pin"
            >
              pin
            </label>
            <input
              type="number"
              className="w-full rounded-md border border-blue-gray-200 bg-transparent  py-2 text-lg text-blue-gray-700 placeholder-blue-gray-500 focus:border-pink-500 focus:outline-none"
              name="pin"
              required
            />
          </div>

          <div className="mb-4 text-red-500">
            {error && <span className="text-sm">Invalid username or pin</span>}
          </div>
          <button
            className="w-full bg-indigo-600 py-2 px-4 text-white rounded-md font-bold uppercase hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
