import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const user = useSelector((state) => state.auth.user); // Get user from Redux state

    useEffect(() => {
      if (!user) {
        router.replace("/auth/login"); // Redirect to login if not authenticated
      }
    }, [user, router]); // Added `router` to the dependency array

    if (!user) return null; // Prevent rendering before redirect

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthComponent;
};

export default withAuth;
