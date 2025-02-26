import { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import { AuthContext, AuthContextProps } from "../../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function Register() {
  const { user } = useContext(AuthContext) as AuthContextProps;
  const { toast } = useToast();

  const navigate = useNavigate();
  if (user) {
    navigate("/dashboard");
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const pinInput = form.elements.namedItem("pin") as HTMLInputElement;
    const mobileNumberInput = form.elements.namedItem(
      "mobileNumber"
    ) as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const roleInput = form.elements.namedItem("role") as HTMLInputElement;
    const nidInput = form.elements.namedItem("nid") as HTMLInputElement;

    const name = nameInput.value;
    const pin = pinInput.value;
    const mobileNumber = Number(mobileNumberInput.value);
    const email = emailInput.value;
    const role = roleInput.value;
    const nid = Number(nidInput.value);

    try {
      setLoading(true);
      console.log(name, pin, mobileNumber, email, role, nid);
      const response = await fetch(
        "https://mfs-web-app-backend.vercel.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            pin: pin,
            mobileNumber: mobileNumber,
            email: email,
            role: role,
            nid: nid,
          }),
        }
      );
      response.json();

      toast({
        title: "Registration successful",
        description: "You have successfully registered",
      });
      // Redirect to login page after successful registration
      navigate("/");
    } catch (error) {
      setError(true);
      console.error(error);
      toast({
        title: "Registration failed",
        description: "Invalid user credentials",
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
            <h4 className="text-2xl font-bold text-gray-900">Create Account</h4>
            <p className="text-gray-500">
              Join our secure mobile financial service
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                type="text"
                name="name"
                required
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="pin"
                required
                placeholder="Enter your pin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="mobileNumber"
                required
                placeholder="Enter your mobile number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="email"
                required
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="role"
                required
              >
                <option value="USER">User</option>
                <option value="AGENT">Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                National ID
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="nid"
                required
                placeholder="Enter your national ID"
              />
            </div>

            <div className="mb-6 text-red-500">
              {error && <span className="text-sm">Registration failed</span>}
            </div>
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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
