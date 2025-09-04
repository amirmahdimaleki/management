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

const registerSchema = z.object({
  name: z.string().min(2, "نام الزامی است"),
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
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
      toast.success("ثبت نام با موفقیت انجام شد!");
      setToken(response.data.token);
      navigate("/profile");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "خطا در ثبت نام";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return (
    <AuthLayout title="ایجاد حساب کاربری" footerText="حساب کاربری دارید؟" footerLinkText="وارد شوید" footerLinkTo="/login">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input label="نام" {...register("name")} error={errors.name?.message} />
        <Input label="ایمیل" type="email" {...register("email")} error={errors.email?.message} />
        <Input label="رمز عبور" type="password" {...register("password")} error={errors.password?.message} />
        <Button type="submit" isLoading={mutation.isPending}>
          ثبت نام
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
