import { useAuthStore } from "../store/auth.store";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/axios";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import toast from "react-hot-toast";

const LATEST_TERMS_VERSION = "2.0";

const TermsConsentModal = () => {
  const { needsConsent, setNeedsConsent } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => api.post("/users/me/terms/consent", { version: LATEST_TERMS_VERSION }),
    onSuccess: () => {
      toast.success("موافقت شما با موفقیت ثبت شد.");
      setNeedsConsent(false);
    },
    onError: () => {
      toast.error("خطایی رخ داد. لطفا دوباره تلاش کنید.");
    },
  });

  return (
    <Modal isOpen={needsConsent} onClose={() => {}} title="شرایط و قوانین جدید">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">شرایط و قوانین جدید</h2>
        <p className="text-text-dim mb-6">شرایط استفاده از خدمات ما به‌روزرسانی شده است. برای ادامه، لطفا با قوانین جدید موافقت کنید.</p>
        <Button onClick={() => mutation.mutate()} isLoading={mutation.isPending}>
          می‌پذیرم و ادامه می‌دهم
        </Button>
      </div>
    </Modal>
  );
};

export default TermsConsentModal;
