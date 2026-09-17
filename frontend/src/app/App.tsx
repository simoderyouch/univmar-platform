import { AuthProvider } from "../features/auth/AuthProvider";
import { LoginPage } from "../features/auth/LoginPage";
import { WorkspaceShell } from "../widgets/app-shell/WorkspaceShell";
import { RouterProvider, useRouter } from "./providers/router";
import { ToastProvider } from "./providers/toast-provider";

function RoutedApp() {
  const { path } = useRouter();
  return <AuthProvider><ToastProvider>{path === "/login" ? <LoginPage /> : <WorkspaceShell />}</ToastProvider></AuthProvider>;
}

export function App() {
  return <RouterProvider><RoutedApp /></RouterProvider>;
}
