import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import ErrorBoundary from "./components/ErrorBoundary";

const toastOptions = {
  duration: 4000,
  style: {
    background: "var(--color-surface)",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border)",
    borderRadius: "0.75rem",
    boxShadow: "0 12px 30px -12px rgba(15, 23, 42, 0.28)",
    fontSize: "0.875rem",
    padding: "0.75rem 1rem",
    maxWidth: "380px",
  },
  success: {
    iconTheme: { primary: "var(--color-success)", secondary: "#ffffff" },
  },
  error: {
    iconTheme: { primary: "var(--color-error)", secondary: "#ffffff" },
  },
};

function App() {
  return (
    <>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
      <Toaster
        position="top-right"
        containerStyle={{ top: 84 }}
        toastOptions={toastOptions}
      />
    </>
  );
}

export default App;