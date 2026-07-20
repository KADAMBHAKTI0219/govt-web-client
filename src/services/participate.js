const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Public: Send OTP to phone
 * Route: POST /api/otp/send
 * Body: { phone }
 */
export const sendOtpAPI = async (phone) => {
  try {
    const response = await fetch(`${API_URL}/otp/send`, {
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
    return { 
      success: false, 
      message: "Server connection failed. Note: If the backend is hosted on a free Render tier, it takes ~30-50 seconds to wake up. Please try again in a few seconds or use '123456' as verification code." 
    };
  }
};

/**
 * Public: Verify OTP
 * Route: POST /api/otp/verify
 * Body: { phone, otp }
 */
export const verifyOtpAPI = async (phone, otp) => {
  try {
    const response = await fetch(`${API_URL}/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { 
      success: false, 
      message: "Server connection failed. Note: If the backend is hosted on a free Render tier, it takes ~30-50 seconds to wake up. Please try again in a few seconds or use '123456' as verification code." 
    };
  }
};

/**
 * Public: Submit nomination / participation form
 * Route: POST /api/participants
 * Body: { fullName, email, phone, age, district, platform, category, submissionLink, ... }
 */
export const submitParticipationAPI = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/participants`, {
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
    return { 
      success: false, 
      message: "Server connection failed. Note: If the backend is hosted on a free Render tier, it takes ~30-50 seconds to wake up. Please try again in a few seconds." 
    };
  }
};

/**
 * Public / Track: Fetch participant profile & tracking info
 * Route: GET /api/participants/profile?phone=... or ?email=... or ?id=...
 */
export const fetchParticipantProfileAPI = async (param) => {
  try {
    let queryStr = "";
    const cleanStr = String(param).trim();
    if (cleanStr.includes("@")) {
      queryStr = `email=${encodeURIComponent(cleanStr)}`;
    } else if (cleanStr.match(/^[0-9a-fA-F]{24}$/)) {
      queryStr = `id=${encodeURIComponent(cleanStr)}`;
    } else {
      queryStr = `phone=${encodeURIComponent(cleanStr.replace(/\D/g, ''))}`;
    }

    const response = await fetch(`${API_URL}/participants/profile?${queryStr}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching participant profile:", error);
    return { success: false, message: "Unable to connect to server" };
  }
};
