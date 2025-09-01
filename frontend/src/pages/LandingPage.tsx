import React from "react";
import { Link } from "react-router-dom";

// Simple SVG icon for feature items
const FeatureIcon = ({ path }: { path: string }) => (
  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
  </svg>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-text font-sans">
      {/* Navigation Header */}
      <header className="py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">ProfileManager</h1>
        <nav className="space-x-4">
          <Link to="/login" className="text-text hover:text-primary transition-colors">
            ورود
          </Link>
          <Link to="/register" className="bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity">
            ثبت نام
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto text-center px-4 py-24">
        <h2 className="text-5xl font-bold text-white leading-tight mt-4">پلتفرم امن و مدرن برای مدیریت حساب کاربری</h2>
        <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
          پروفایل خود را به راحتی ویرایش کنید، اعتبارسنجی‌ها را مدیریت کرده و با خیالی آسوده از امنیت اطلاعات خود لذت ببرید.
        </p>
        <div className="mt-10">
          <Link to="/register" className="bg-primary text-white text-lg font-semibold py-3 px-8 rounded-md hover:opacity-90 transition-opacity">
            شروع کنید
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Feature 1: Profile Management */}
            <div className="flex flex-col items-center">
              <FeatureIcon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              <h3 className="text-xl font-bold text-white mt-4">مدیریت پروفایل</h3>
              <p className="text-gray-400 mt-2">اطلاعات شخصی خود را به سادگی ویرایش و به‌روزرسانی کنید.</p>
            </div>

            {/* Feature 2: Secure Credentials */}
            <div className="flex flex-col items-center">
              <FeatureIcon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              <h3 className="text-xl font-bold text-white mt-4">اعتبارسنجی امن</h3>
              <p className="text-gray-400 mt-2">تغییر ایمیل و رمز عبور با تایید دو مرحله‌ای (OTP).</p>
            </div>

            {/* Feature 3: Full Control */}
            <div className="flex flex-col items-center">
              <FeatureIcon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              <h3 className="text-xl font-bold text-white mt-4">کنترل کامل</h3>
              <p className="text-gray-400 mt-2">مشاهده آخرین ورودها و مدیریت کامل دسترسی‌های شما.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500">
        <p>&copy; 2025 ProfileManager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
