import { useContext } from "react";
import { AccountContext } from "../../context/AccountContext";

const { Outlet, Navigate } = require("react-router-dom");

const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
};

const PrivateRoute = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to={"/"} />;
};

export default PrivateRoute;
