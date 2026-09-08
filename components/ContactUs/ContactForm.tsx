"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Mail, Phone, Send, Clock, CheckCircle } from "lucide-react";
import { fetchApi, handleApiError } from "@/services/api";

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const COOLDOWN_KEY = "contact_form_last_submit";
const timer = Number(process.env.NEXT_PUBLIC_CONTACT_MESSAGE_TIME) || 10;
const COOLDOWN_MINUTES = timer;

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Check for existing cooldown on mount
  useEffect(() => {
    const storedTime = localStorage.getItem(COOLDOWN_KEY);
    if (storedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(storedTime, 10)) / 1000);
      const remaining = COOLDOWN_MINUTES * 60 - elapsed;
      if (remaining > 0) {
        setIsCooldown(true);
        setCooldownSeconds(remaining);
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isCooldown || cooldownSeconds <= 0) return;

    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          setIsCooldown(false);
          localStorage.removeItem(COOLDOWN_KEY);
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCooldown, cooldownSeconds]);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?\d{10,15}$/;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const trimmedData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
    };
    const errors: FormErrors = {};

    if (!trimmedData.name) {
      errors.name = "Name is required.";
    } else if (!/^[\p{L} .'-]+$/u.test(trimmedData.name)) {
      errors.name = "Name can contain letters, spaces, apostrophes, and hyphens only.";
    }

    if (!emailPattern.test(trimmedData.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!phonePattern.test(trimmedData.phone.replace(/[\s()-]/g, ""))) {
      errors.phone = "Enter a valid phone number with 10 to 15 digits.";
    }

    if (!trimmedData.message) {
      errors.message = "Message is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await fetchApi("/contactus", {
        method: "POST",
        body: JSON.stringify(trimmedData),
      });

      // Set cooldown in localStorage
      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      setIsCooldown(true);
      setCooldownSeconds(COOLDOWN_MINUTES * 60);

      setSuccessMessage(
        "Thank you for reaching out! Our team will contact you within 24 hours.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
      setFormErrors({});
    } catch (err) {
      handleApiError(err, setErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const contactItems = [
    {
      icon: <Phone size={18} />,
      label: "Phone",
      value: "+91 7992255760",
    },

    {
      icon: <Mail size={18} />,
      label: "Email",
      value: "support@pennytor.com",
    },
  ];

  return (
    <section className="w-full overflow-hidden  px-4 py-10 sm:px-6 md:px-8 lg:px-12 lg:py-16">
      <motion.div
        className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 overflow-hidden rounded-[28px] border border-white/5 bg-[#121212] p-5 shadow-2xl sm:p-7 md:rounded-[36px] md:p-10 lg:grid-cols-2 lg:gap-12 lg:p-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* LEFT COLUMN */}
        <div className="flex flex-col justify-between  lg:pr-6">
          {/* TOP CONTENT */}
          <div className="space-y-5">
            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-normal leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Let’s{" "}
              <span className="font-serif italic font-light text-zinc-300">
                Grow With
              </span>
              <span className="block">Pennytor !</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base md:text-lg"
            >
              Institutional-grade support for the sophisticated investor. Reach
              out to our dedicated advisory team for personalized portfolio
              assistance.
            </motion.p>
          </div>

          {/* CONTACT DETAILS */}
          <motion.div
            variants={itemVariants}
            className="grid gap-10 border-t border-white/10 pt-15"
          >
            {contactItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                }}
                className="flex items-start gap-5"
              >
                <motion.div
                  whileHover={{
                    scale: 1.08,
                    rotate: 8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 12,
                  }}
                  className=" flex shrink-0 items-center justify-center rounded-full bg-blue-600 p-3 text-white transition-all duration-300  hover:bg-blue-700 active:bg-blue-800"
                >
                  {item.icon}
                </motion.div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    {item.label}
                  </p>

                  <span className="wrap-break-word text-sm font-medium leading-relaxed text-neutral-200 sm:text-base">
                    {item.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: 40,
              scale: 0.96,
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
          whileHover={{
            y: -4,
          }}
          className="w-full rounded-[26px] border border-white/10 bg-[#0F172A] p-5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-6 md:rounded-[32px] md:p-8 lg:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* GRID */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* NAME */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  aria-invalid={Boolean(formErrors.name)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/40 transition-all duration-300 focus:border-blue-400 focus:bg-white/[0.07] focus:outline-none sm:px-5 sm:py-4 sm:text-base"
                />
                {formErrors.name && (
                  <p className="text-xs text-red-400">{formErrors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(formErrors.email)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/40 transition-all duration-300 focus:border-blue-400 focus:bg-white/[0.07] focus:outline-none sm:px-5 sm:py-4 sm:text-base"
                />
                {formErrors.email && (
                  <p className="text-xs text-red-400">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* PHONE */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="+91 98XXX XXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
                inputMode="tel"
                aria-invalid={Boolean(formErrors.phone)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/40 transition-all duration-300 focus:border-blue-400 focus:bg-white/[0.07] focus:outline-none sm:px-5 sm:py-4 sm:text-base"
              />
              {formErrors.phone && (
                <p className="text-xs text-red-400">{formErrors.phone}</p>
              )}
            </div>

            {/* MESSAGE */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Message
              </label>

              <textarea
                rows={5}
                name="message"
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={handleChange}
                required
                minLength={10}
                aria-invalid={Boolean(formErrors.message)}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/40 transition-all duration-300 focus:border-blue-400 focus:bg-white/[0.07] focus:outline-none sm:px-5 sm:py-4 sm:text-base"
              />
              {formErrors.message && (
                <p className="text-xs text-red-400">{formErrors.message}</p>
              )}
            </div>

            {successMessage && (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                <p role="status" className="text-sm text-emerald-300">
                  {successMessage}
                </p>
              </div>
            )}

            {errorMessage && (
              <p role="alert" className="text-sm text-red-400">
                {errorMessage}
              </p>
            )}

            {/* BUTTON */}
            {!isCooldown && (
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                }}
                className="group mx-auto flex w-full items-center justify-center gap-3 rounded-full bg-blue-600 px-6 py-3 text-[13px] font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit sm:px-8 sm:text-sm"
              >
                <div className="rotate-45 flex items-center justify-center rounded-full bg-white p-2 text-blue-600 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-0">
                  <Send size={14} className={isSubmitting ? "animate-pulse" : "rotate-0"} />
                </div>

                <span>{isSubmitting ? "Sending..." : "Submit Message"}</span>
              </motion.button>
            )}
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
}
