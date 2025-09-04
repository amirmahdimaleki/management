import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setNeedsConsent = useAuthStore((state) => state.setNeedsConsent);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => api.post("/auth/login", data),
    onSuccess: (response) => {
      toast.success("ورود با موفقیت انجام شد!");
      setToken(response.data.token);
      if (response.data.user.needsConsent) {
        setNeedsConsent(true);
      }
      navigate("/profile");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "ایمیل یا رمز عبور اشتباه است";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <AuthLayout title="ورود به حساب کاربری" footerText="حساب کاربری ندارید؟" footerLinkText="ثبت نام کنید" footerLinkTo="/register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input label="ایمیل" type="email" {...register("email")} error={errors.email?.message} />
        <Input label="رمز عبور" type="password" {...register("password")} error={errors.password?.message} />
        <Button type="submit" isLoading={mutation.isPending}>
          ورود
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
