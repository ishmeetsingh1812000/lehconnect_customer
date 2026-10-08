import axios from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    allowGuestRetry?: boolean;
    skipCustomerAuth?: boolean;
    _retry?: boolean;
    _guestRetry?: boolean;
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1/api";
const AccessToken =
  "7c5b3f91d8ea42c6f1a7b9d3e4c58a1079ef2b6d3a5c1f84e8b9a2d7c6f0135";
const GOOGLE_API_KEY = "AIzaSyAJw4JRBHRT_tTQdms4XD7YpYz4dOhiBX4";
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    AccessToken: AccessToken,
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("customerToken")
        : null;
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("customerRefreshToken")
        : null;
    if (config.skipCustomerAuth && config.headers) {
      delete config.headers.Authorization;
      delete config.headers["x-refresh-token"];
    } else if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      if (refreshToken) {
        config.headers["x-refresh-token"] = refreshToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const hasCustomerToken =
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem("customerToken"));
    if (
      error.response?.status === 401 &&
      hasCustomerToken &&
      !originalRequest._retry &&
      originalRequest.url !== "/refresh-token"
    ) {
      originalRequest._retry = true;
      try {
        const res = await refreshUserToken();
        const newToken = res?.results?.token;
        const newRefreshToken = res?.results?.refreshToken;
        if (!newToken || !newRefreshToken) {
          throw new Error("Session refresh response did not include valid tokens.");
        }

        localStorage.setItem("customerToken", newToken);
        localStorage.setItem("customerRefreshToken", newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers["x-refresh-token"] = newRefreshToken;
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("customerToken");
          localStorage.removeItem("customerRefreshToken");
          window.dispatchEvent(new Event("customer-session-expired"));
        }

        if (originalRequest.allowGuestRetry && !originalRequest._guestRetry) {
          originalRequest._guestRetry = true;
          originalRequest.skipCustomerAuth = true;
          delete originalRequest.headers.Authorization;
          delete originalRequest.headers["x-refresh-token"];
          return apiClient(originalRequest);
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export const submitCabEnquiry = async (enquiryData) => {
  const response = await apiClient.post("/customer/cab/enquiry", enquiryData);
  return response.data;
};

export const submitHolidayEnquiry = async (enquiryData) => {
  const response = await apiClient.post(
    "/customer/holiday/package/enquiry",
    enquiryData,
  );
  return response.data;
};

export const submitFlightEnquiry = async (enquiryData) => {
  const response = await apiClient.post(
    "/customer/flight-enquiry",
    enquiryData,
  );
  return response.data;
};

export const submitHotelEnquiry = async (enquiryData) => {
  const response = await apiClient.post("/customer/hotel/enquiry", enquiryData);
  return response.data;
};

export const submitTrainEnquiry = async (enquiryData) => {
  const response = await apiClient.post("/customer/train/enquiry", enquiryData);
  return response.data;
};

export const submitBusEnquiry = async (enquiryData) => {
  const response = await apiClient.post("/customer/bus/enquiry", enquiryData);
  return response.data;
};

export const submitVisaEnquiry = async (enquiryData) => {
  const response = await apiClient.post("/customer/visa/enquiry", enquiryData);
  return response.data;
};

export const submitInsuranceEnquiry = async (enquiryData) => {
  const response = await apiClient.post(
    "/customer/insurance/enquiry",
    enquiryData,
  );
  return response.data;
};

export const searchLocations = async (query) => {
  const response = await apiClient.get(`/country-api?q=${query}`);
  return response.data;
};

export const getEnquiryOffers = async () => {
  const response = await apiClient.get("/customer/enquiry-offers");
  return response.data;
};

export const sendOtp = async (phone, identity = "customer") => {
  const response = await apiClient.post("/getOtp", { phone, identity });
  return response.data;
};

export const verifyOtp = async (phone, otp, identity = "customer") => {
  const response = await apiClient.post("/verifyOtp", { phone, otp, identity });
  return response.data;
};

export const logoutUser = async (fcmToken = "") => {
  const response = await apiClient.post("/customer/logout", { fcmToken });
  return response.data;
};

export const getCustomerProfile = async () => {
  const response = await apiClient.get("/customer/get-profile");
  return response.data;
};

export const updateCustomerProfile = async (profileData) => {
  const response = await apiClient.put(
    "/customer/update-basic-details",
    profileData,
  );
  return response.data;
};

export const searchCabs = async (searchData) => {
  const response = await apiClient.get(
    `/customer/cab/route/${searchData.slug}`,
    { params: searchData },
  );
  console.log("cab search logss", response);
  return response.data;
};

export const refreshUserToken = async (
  fcmToken = "",
  device_id = "",
  platformName = "android",
) => {
  const response = await apiClient.post("/refresh-token", {
    fcmToken,
    device_id,
    platformName,
  });
  return response.data;
};

export const getDistance = async (origin, destination) => {
  try {
    const url = `/api/distance?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    if (response.data && response.data.rows && response.data.rows.length > 0) {
      const element = response.data.rows[0].elements[0];
      if (element.status === "OK") {
        return {
          distanceText: element.distance.text,
          distanceValue: element.distance.value,
          durationText: element.duration.text,
          durationValue: element.duration.value,
        };
      }
    }
  } catch (error) {
    // Silently fallback to avoid Next.js error overlay on CORS issues
  }
  return null;
};

export const getPopularCabRoutes = async (pickup = "", drop = "") => {
  const response = await apiClient.get(`/customer/cab/popular-routes`, {
    params: { pickup, drop },
  });
  console.log("popular routes response", response);
  return response.data;
};

export const getCabPackages = async () => {
  const response = await apiClient.get("/customer/cab-packages");
  return response.data;
};

export const createCabBooking = async (payload) => {
  const response = await apiClient.post(
    "/customer/cab/booking/create",
    payload,
    { allowGuestRetry: true },
  );
  console.log("createCabBooking response", response);
  return response.data;
};

export const createCabBookingOrder = async (payload) => {
  const response = await apiClient.post(
    "/customer/cab/booking/create-order",
    payload,
    { allowGuestRetry: true },
  );
  console.log("createCabBookingOrder response", response);
  return response.data;
};

export const verifyCabBookingPayment = async (payload) => {
  const response = await apiClient.post(
    "/customer/cab/booking/verify-payment",
    payload,
    { allowGuestRetry: true },
  );
  console.log("verifyCabBookingPayment response", response);
  return response.data;
};

export const getCabBookingPreview = async (payload) => {
  const { data } = await apiClient.post(
    "/customer/cab/booking/preview",
    payload,
    { allowGuestRetry: true },
  ); // use your axios instance
  return data;
};

export const getCoupons = async () => {
  const res = await apiClient.get("/customer/coupons"); // -> /v1/api/customer/coupons
  return res.data;
};
