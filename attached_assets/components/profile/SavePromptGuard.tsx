import { useEffect } from "react";
import { useRouter } from "next/router";

export function SavePromptGuard({ active, children }: { active: boolean, children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (active && !confirm("You have unsaved changes. Continue without saving?")) {
        throw "Route change aborted";
      }
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [active]);

  return <>{children}</>;
}
