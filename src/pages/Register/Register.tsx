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
      const response = await fetch("http://localhost:5000/auth/register", {
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
      });
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
    <div className="">
      <div className="flex items-center justify-center h-screen bg-gray-100 ">
        <div className="">
          {" "}
          <div className="flex flex-col items-center rounded-xl bg-white  py-12 md:px-32 shadow-lg">
            <h4 className="text-3xl font-semibold text-indigo-600 mb-2">
              Register
            </h4>
            <p className="text-base text-gray-700 mb-6">
              Fill in the details to create an account.
            </p>
            <form onSubmit={handleRegister} className="w-full max-w-md">
              <div className="mb-4">
                <label
                  className="block text-sm font-normal text-blue-gray-700 mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="w-full rounded-md border border-blue-gray-200 bg-transparent py-2 text-lg text-blue-gray-700 placeholder-blue-gray-500 focus:border-pink-500 focus:outline-none"
                  type="text"
                  name="name"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-normal text-blue-gray-700 mb-2"
                  htmlFor="pin"
                >
                  Pin
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border border-blue-gray-200 bg-transparent py-2 text-lg text-blue-gray-700 placeholder-blue-gray-500 focus:border-pink-500 focus:outline-none"
                  name="pin"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-normal text-blue-gray-700 mb-2"
                  htmlFor="mobileNumber"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  className="w-full rounded-md border border-blue-gray-200 bg-transparent py-2 text-lg text-blue-gray-700 placeholder-blue-gray-500 focus:border-pink-500 focus:outline-none"
                  name="mobileNumber"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-normal text-blue-gray-700 mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-blue-gray-200 bg-transparent py-2 text-lg text-blue-gray-700 placeholder-blue-gray-500 focus:border-pink-500 focus:outline-none"
                  name="email"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-normal text-blue-gray-700 mb-2"
                  htmlFor="role"
                >
                  Role
                </label>
                <select
                  className="w-full rounded-md border border-blue-gray-200 bg-transparent py-2 text-lg text-blue-gray-700 placeholder-blue-gray-500 focus:border-pink-500 focus:outline-none"
                  name="role"
                  required
                >
                  <option value="USER">User</option>
                  <option value="AGENT">Agent</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-normal text-blue-gray-700 mb-2"
                  htmlFor="nid"
                >
                  National ID
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-blue-gray-200 bg-transparent py-2 text-lg text-blue-gray-700 placeholder-blue-gray-500 focus:border-pink-500 focus:outline-none"
                  name="nid"
                  required
                />
              </div>

              <div className="mb-6 text-red-500">
                {error && <span className="text-sm">Registration failed</span>}
              </div>
              <button
                className="w-full bg-indigo-600 py-2 px-4 text-white rounded-md font-bold uppercase hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Register;
