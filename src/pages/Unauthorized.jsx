import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard/home");
    }, 5000);

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl text-red-600 font-semibold mb-4">
        You are not authorized to view this page.
      </h1>
      <p className="text-gray-600">Redirecting you to home in 5 seconds...</p>
    </div>
  );
}
