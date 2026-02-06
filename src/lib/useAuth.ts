/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedData = localStorage.getItem("user");

        console.log("LocalStorage Data:", storedData);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUser(parsedData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth Hook Error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, isLoading };
};
