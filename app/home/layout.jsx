import { AuthProvider } from "../contexts/AuthProvider";

export default function HomeLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
