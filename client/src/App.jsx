import router from "./router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <div className="App">
      <UserProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </UserProvider>
      <Toaster />
    </div>
  );
}
