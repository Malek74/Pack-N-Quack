import router from "./router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { UserProvider } from "./context/UserContext";
export default function App() {
  return (
    <div className="App">
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      <Toaster />
    </div>
  );
}
