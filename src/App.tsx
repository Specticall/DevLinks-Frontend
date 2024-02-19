import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterSuccess from "./Pages/RegisterSuccess";
import { CookiesProvider } from "react-cookie";
import AppLayout, { loader as appLoader } from "./Pages/AppLayout";
import Link from "./Pages/Link";
import Profile from "./Pages/Profile";
import Preview, { loader as previewLoader } from "./Pages/Preview";
import { PopupProvider } from "./Context/PopupContext";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/register/success",
      element: <RegisterSuccess />,
    },
    {
      path: "/app",
      element: <AppLayout />,
      loader: appLoader,
      children: [
        {
          path: "/app",
          element: <Navigate to="link" replace />,
        },
        { path: "link", element: <Link /> },
        { path: "profile", element: <Profile /> },
      ],
    },
    {
      path: "/preview/:name?",
      element: <Preview />,
      loader: previewLoader,
    },
  ]);
  const queryClient = new QueryClient();

  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <QueryClientProvider client={queryClient}>
        <PopupProvider>
          <RouterProvider router={router} />
        </PopupProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
};

export default App;
