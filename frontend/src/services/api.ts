import axios from "axios";
const API_BASE_URL = "https://teenxcel-production.up.railway.app/api";
// const API_BASE_URL = "http://localhost:8000/api"


// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is correct for cookies
  // Add these headers for better cookie handling
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("AdminAccessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is expired or invalid, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("AdminAccessToken");
      // Optionally redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication
export const apiLogin = async (username: string, password: string) => {
  try {
    const response = await api.post("/admin/login", { email : username, password });
    if (response.data.token) {
      localStorage.setItem("AdminAccessToken", response.data.token);
    }
    return { success: true, ...response.data };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || "Login failed" 
    };
  }
};

export const apiCheckLoggedIn = async () => {
  try {
    // Make sure to include withCredentials for this check
    const response = await api.get("/admin/loggedin", {
      withCredentials: true
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    // If we get a 401, the user is not authenticated
    if (error.response?.status === 401) {
      localStorage.removeItem("AdminAccessToken");
    }
    return { success: false };
  }
};

// Add logout functionality
export const apiLogout = async () => {
  try {
    // Ensure cookies are sent with logout request
    const response = await api.post("/admin/logout", {}, {
      withCredentials: true
    });
    console.log(response)
    localStorage.removeItem("AdminAccessToken");
    return { success: true, ...response.data };
  } catch (error: any) {
    // Even if logout fails on server, clear local token
    localStorage.removeItem("AdminAccessToken");
    return { 
      success: false, 
      message: error.response?.data?.message || "Logout failed" 
    };
  }
};

// Initialize auth on app start
export const initializeAuth = () => {
  const token = localStorage.getItem("AdminAccessToken");
  if (token) {
    // Token is already set via interceptor
    return true;
  }
  return false;
};

// Call Requests
export const getAllCalls = async () => {
  try {
    const response = await api.get("/admin/calls" , {} , {withCredentials : true});
    console.log(response)
    console.log(response.data.data)
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteCall = async (id: string) => {
  try {
    const response = await api.post(`/admin/delete-call/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateCallStatus = async (id: string, status: string) => {
  try {
    const response = await api.post(`/admin/update-call/${id}`, { status });
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

// Payment Requests
export const getAllPayments = async () => {
  try {
    const response = await api.get("/admin/payments");
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const updatePaymentStatus = async (id: string, status: string) => {
  try {
    const response = await api.post(`/admin/update-payment/${id}`, { status });
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const deletePayment = async (id: string) => {
  try {
    const response = await api.post(`/admin/delete-payment/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

// Coupons
export const getAllCoupons = async () => {
  try {
    const response = await api.get("/coupons/get");
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const createCoupon = async (couponData: {
  code: string;
  offPercentage: number;
  maxDiscount?: number;
}) => {
  try {
    const response = await api.post("/coupons/create", couponData);
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteCoupon = async (id: string) => {
  try {
    const response = await api.post(`/coupons/delete/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

// Courses
export const getAllCourses = async () => {
  try {
    const response = await api.get("/courses/get-all" , {} , {withCredentials : true});
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const getCourseById = async (id: string) => {
  try {
    const response = await api.get(`/courses/get-course/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createCourse = async (courseData: FormData) => {
  console.log(courseData)
  try {
    const response = await api.post('/courses/create', courseData, {
      headers: {
        // Let the browser set Content-Type automatically for FormData
        // 'Content-Type': 'multipart/form-data' is not needed
      },
    });

    console.log('Create course response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create course error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'Failed to create course');
  }
};

export const updateCourse = async (courseData: any) => {
  try {
    const response = await api.post("/courses/update", courseData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const response = await api.post(`/courses/delete/${id}` , {} , {withCredentials : true});
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllNotifications = async () => {
  const response = await api.get('/notifications/get');
  return response.data.data;
};

export const createNotification = async (notificationData) => {
  const response = await api.post('/notifications/create', notificationData);
  return response.data.data;
};

export const deleteNotification = async (id) => {
  const response = await api.post(`/notifications/delete/${id}`);
  return response.data.data;
};

export const deleteCareer = async(id)=>{
  const response = await api.post(`/admin/delete-join-request/${id}`);
  return response.data.data;
}

export const getAllCareers = async()=>{
  const response = await api.get('/admin/career-requests');
  return response.data.data;
}