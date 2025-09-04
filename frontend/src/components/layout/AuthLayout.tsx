import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  footerLinkTo: string;
  footerLinkText: string;
  footerText: string;
}

const AuthLayout = ({ title, children, footerLinkTo, footerLinkText, footerText }: AuthLayoutProps) => {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-surface p-8 rounded-lg shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">{title}</h1>
        {children}
        <p className="text-center mt-4 text-sm text-text-dim">
          {footerText}{" "}
          <Link to={footerLinkTo} className="font-semibold text-accent hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </motion.div>
    </main>
  );
};

export default AuthLayout;
