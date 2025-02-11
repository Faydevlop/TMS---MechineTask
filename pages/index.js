import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login"); // Redirect to login
  }, []);

  return null; // Prevent rendering content before redirect
}
