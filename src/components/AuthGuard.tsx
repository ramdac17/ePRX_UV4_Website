import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#d4ff00",
        }}
      >
        LOADING_SESSION...
      </div>
    );

  return <>{children}</>;
}

const styles: { [key: string]: React.CSSProperties } = {
  loaderContainer: {
    height: "100vh",
    backgroundColor: "#0f0f0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    color: "#d4ff00",
    letterSpacing: "4px",
    fontSize: "0.8rem",
  },
};
