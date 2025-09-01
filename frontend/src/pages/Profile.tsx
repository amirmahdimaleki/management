import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuthStore } from "../store/auth.store";
import Button from "../components/ui/Button";

const ProfilePage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/users/me").then((res) => res.data.user),
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile.</div>;

  return (
    <main className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Your Profile</h1>
          <Button onClick={handleLogout} className="w-auto !py-2">
            Logout
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="text-lg">{data.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-lg">{data.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Last Login</p>
            <p className="text-lg">{data.lastLogin ? new Date(data.lastLogin).toLocaleString() : "Never"}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
