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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="flex flex-col items-center justify-center min-h-screen max-w-md mx-auto">
        <div className="w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <svg
              className="w-16 h-16 mx-auto text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.91c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
            </svg>
            <h4 className="text-2xl font-bold text-gray-900">Welcome Back</h4>
            <p className="text-gray-500">Access your MFS wallet securely</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number or Email
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                type="text"
                name="emailOrMBNo"
                placeholder="Enter mobile number or email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIN
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="pin"
                placeholder="Enter your PIN"
                required
                maxLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                Invalid credentials. Please try again.
              </div>
            )}

            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Login to Wallet"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
