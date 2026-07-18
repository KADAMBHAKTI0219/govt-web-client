const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const sendOtpAPI = async (phone) => {
  try {
    const response = await fetch(`${API_URL}/participate/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Server connection failed" };
  }
};

export const submitParticipationAPI = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/participate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting participation:", error);
    return { success: false, message: "Server connection failed" };
  }
};
