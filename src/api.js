import { apiBase } from "./constants";

export const login = async () => {
  try {
    const response = await fetch(apiBase + "users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAgent: navigator.userAgent,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        platform: navigator.platform,
        language: navigator.language,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.data.userId) {
      return result.data.userId;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};
