import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuthStore } from "../store/auth.store";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => api.post("/auth/register", data),
    onSuccess: (response) => {
      setToken(response.data.token);
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      // Add user-facing error message (e.g., using a toast notification)
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input label="Name" {...register("name")} error={errors.name?.message} />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
        <Button type="submit" isLoading={mutation.isPending}>
          Register
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
