import React from "react";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">{title}</h1>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
