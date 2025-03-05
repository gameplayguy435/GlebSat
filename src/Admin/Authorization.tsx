import { Navigate, Outlet } from 'react-router-dom';

const Authorization = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return <Navigate to="/admin/login" replace/>;
    }

    return <Outlet />;
};

export default Authorization;