import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <Link to="/profile" className="mt-6 text-lg text-accent hover:underline">
        Go to your Profile
      </Link>
    </div>
  );
};

export default NotFoundPage;
