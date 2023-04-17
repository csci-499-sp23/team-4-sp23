import { Navigate } from "react-router-dom";

const Protected = ({ isLoggedIn, children }) => {
  if (isLoggedIn === false) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default Protected;
