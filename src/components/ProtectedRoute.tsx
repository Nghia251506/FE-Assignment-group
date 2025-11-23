import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


interface PrivateRouteProps {
  children: JSX.Element;
  roleName?: string; // optional: admin | user
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roleName }) => {
  const { currentUser } = useSelector((state: RootState) => state.auth);


  // chưa đăng nhập
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // có yêu cầu role nhưng user không khớp
  if (roleName && currentUser.roleName !== roleName) {
    return <Navigate to="/" replace />; // hoặc 403 page
  }

  return children;
};

export default PrivateRoute;