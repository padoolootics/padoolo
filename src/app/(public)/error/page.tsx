import { Suspense } from "react";
import AuthErrorPage from "./error-bar";

function ErrorBarFallback() {
  return <>Having error with login, please try after some time.</>;
}

export default function Page() {
  return (
    <>
      <Suspense fallback={<ErrorBarFallback />}>
        <AuthErrorPage />
      </Suspense>
    </>
  );
}
