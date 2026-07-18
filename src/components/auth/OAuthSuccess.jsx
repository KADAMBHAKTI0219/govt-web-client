import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("accessToken");
    if (token) {
      loginWithToken(token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-screen bg-[#04081c] flex items-center justify-center text-white select-none">
      <div className="text-center flex flex-col items-center gap-5">
        {/* Loading Spinner */}
        <div className="w-12 h-12 border-4 border-t-[#FFA320] border-white/20 rounded-full animate-spin" />
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-white/70">
          Authenticating with Google...
        </h2>
      </div>
    </div>
  );
}
