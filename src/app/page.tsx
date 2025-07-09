import SignInPage from "@/app/auth/signin/page";
import AuthLayout from "@/app/auth/layout";

export default function HomePage() {
  return (
    <AuthLayout>
      <SignInPage />
    </AuthLayout>
  );
} 