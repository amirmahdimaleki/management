import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuthStore } from "../store/auth.store";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, ReactNode } from "react";
import { motion } from "framer-motion";

// Schemas
const nameSchema = z.object({ name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد") });
const passwordSchema = z.object({
  oldPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
  newPassword: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد"),
});
const emailSchema = z.object({ newEmail: z.string().email("ایمیل معتبر نیست") });
const phoneSchema = z.object({ newPhone: z.string().min(10, "شماره تلفن معتبر نیست") });
const otpSchema = z.object({ otp: z.string().length(6, "کد باید ۶ رقمی باشد") });

// Form types
type NameFormData = z.infer<typeof nameSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type EmailFormData = z.infer<typeof emailSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

const ProfileCard = ({ children }: { children: ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-surface p-6 rounded-lg shadow-md">
    {children}
  </motion.div>
);

const StatusBadge = ({ verified }: { verified: boolean }) =>
  verified ? <span className="text-sm font-bold text-green-400">تایید شده</span> : <span className="text-sm font-bold text-yellow-400">در انتظار تایید</span>;

const ProfilePage = () => {
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [otpTarget, setOtpTarget] = useState<"email" | "phone" | null>(null);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/users/me").then((res) => res.data.user),
  });

  const nameForm = useForm<NameFormData>({ resolver: zodResolver(nameSchema) });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });
  const emailForm = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });
  const phoneForm = useForm<PhoneFormData>({ resolver: zodResolver(phoneSchema) });
  const otpForm = useForm<OtpFormData>({ resolver: zodResolver(otpSchema) });

  const startEmailChangeMutation = useMutation({
    mutationFn: (data: EmailFormData) => api.post("/users/me/email/change/start", data),
    onSuccess: (data) => {
      toast.success(data.data.message);
      setOtpTarget("email");
      setOtpModalOpen(true);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "خطا در شروع فرآیند"),
  });

  const startPhoneChangeMutation = useMutation({
    mutationFn: (data: PhoneFormData) => api.post("/users/me/phone/change/start", data),
    onSuccess: (data) => {
      toast.success(data.data.message);
      setOtpTarget("phone");
      setOtpModalOpen(true);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "خطا در شروع فرآیند"),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: OtpFormData) => {
      const endpoint = otpTarget === "email" ? "/users/me/email/change/verify" : "/users/me/phone/change/verify";
      return api.post(endpoint, data);
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      setOtpModalOpen(false);
      otpForm.reset();
      emailForm.reset();
      phoneForm.reset();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("کد وارد شده صحیح نیست."),
  });

  // Other mutations (updateName, changePassword) would be here...

  if (isLoading) return <div className="text-center p-10 text-xl font-bold">در حال بارگذاری پروفایل...</div>;
  if (error) return <div className="text-center p-10 text-red-500">خطا در بارگذاری پروفایل</div>;

  return (
    <>
      <main className="container mx-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">حساب کاربری</h1>
              <p className="text-text-dim mt-1">اطلاعات کاربری و امنیتی خود را مدیریت کنید.</p>
            </div>
            <Button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-auto !py-2 !px-4 !bg-red-600 hover:!bg-red-700"
            >
              خروج
            </Button>
          </motion.div>

          <ProfileCard>
            <h2 className="text-xl font-bold mb-4 text-white">اطلاعات پروفایل</h2>
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-dim">وضعیت تایید ایمیل:</p>
              <StatusBadge verified={user.isEmailVerified} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-dim">وضعیت تایید شماره تلفن:</p>
              <StatusBadge verified={user.isPhoneVerified} />
            </div>
          </ProfileCard>

          <ProfileCard>
            <h2 className="text-xl font-bold mb-4 text-white">تغییر ایمیل</h2>
            <form onSubmit={emailForm.handleSubmit((data) => startEmailChangeMutation.mutate(data))} className="space-y-4">
              <Input label="ایمیل فعلی" defaultValue={user.email} disabled />
              <Input label="ایمیل جدید" {...emailForm.register("newEmail")} error={emailForm.formState.errors.newEmail?.message} />
              <div className="flex justify-end">
                <Button type="submit" isLoading={startEmailChangeMutation.isPending} className="w-auto !py-2 !px-4">
                  ارسال کد تایید
                </Button>
              </div>
            </form>
          </ProfileCard>

          <ProfileCard>
            <h2 className="text-xl font-bold mb-4 text-white">تغییر شماره تلفن</h2>
            <form onSubmit={phoneForm.handleSubmit((data) => startPhoneChangeMutation.mutate(data))} className="space-y-4">
              <Input label="شماره تلفن فعلی" defaultValue={user.phone || "ثبت نشده"} disabled />
              <Input label="شماره تلفن جدید" {...phoneForm.register("newPhone")} error={phoneForm.formState.errors.newPhone?.message} />
              <div className="flex justify-end">
                <Button type="submit" isLoading={startPhoneChangeMutation.isPending} className="w-auto !py-2 !px-4">
                  ارسال کد تایید
                </Button>
              </div>
            </form>
          </ProfileCard>
        </div>
      </main>

      <Modal isOpen={isOtpModalOpen} onClose={() => setOtpModalOpen(false)} title="تایید کد یکبار مصرف">
        <form onSubmit={otpForm.handleSubmit((data) => verifyOtpMutation.mutate(data))} className="space-y-4">
          <p className="text-text-dim">کد ۶ رقمی ارسال شده را وارد کنید.</p>
          <Input label="کد تایید" {...otpForm.register("otp")} error={otpForm.formState.errors.otp?.message} />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" onClick={() => setOtpModalOpen(false)} className="w-auto !py-2 !px-4 !bg-secondary">
              انصراف
            </Button>
            <Button type="submit" isLoading={verifyOtpMutation.isPending} className="w-auto !py-2 !px-4">
              تایید
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfilePage;
