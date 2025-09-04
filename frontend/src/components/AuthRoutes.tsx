
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRoutes = () => {
    const { token } = useAuth();

    return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default AuthRoutes;
