"use client";

import { motion } from "framer-motion";
import { ExternalLink, X as XIcon, Youtube, MessageSquare, Github, Instagram } from "lucide-react";
import type { IntentResult } from "@/lib/intent-router";

interface ResponseCardProps {
  result: IntentResult;
}

export default function ResponseCard({ result }: ResponseCardProps) {
  const getIcon = () => {
    switch (result.destination) {
      case "x":
        return <XIcon size={32} className="text-white" />;
      case "youtube":
        return <Youtube size={32} className="text-white" />;
      case "discord":
        return <MessageSquare size={32} className="text-white" />;
      case "github":
        return <Github size={32} className="text-white" />;
      case "instagram":
        return <Instagram size={32} className="text-white" />;
      default:
        return <ExternalLink size={32} className="text-white" />;
    }
  };

  const getGradient = () => {
    switch (result.destination) {
      case "x":
        return "from-black via-gray-900 to-blue-900";
      case "youtube":
        return "from-red-600 via-red-700 to-black";
      case "discord":
        return "from-indigo-600 via-purple-600 to-pink-600";
      case "github":
        return "from-gray-900 via-purple-900 to-violet-900";
      case "instagram":
        return "from-purple-600 via-pink-600 to-orange-500";
      default:
        return "from-blue-600 via-purple-600 to-pink-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-[90%] max-w-md"
      >
        {/* Animated background glow */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute inset-0 bg-gradient-to-br ${getGradient()} blur-3xl rounded-3xl`}
        />

        {/* Card content */}
        <div className="relative bg-[#1e1f22] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
          {/* Animated background pattern */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            {/* Icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-lg`}
            >
              {getIcon()}
            </motion.div>

            {/* Message */}
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {result.message}
              </motion.h3>
              {result.url && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-400"
                >
                  Opening in a moment...
                </motion.p>
              )}
            </div>

            {/* Loading indicator */}
            {result.url && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "linear" }}
                className={`h-1 bg-gradient-to-r ${getGradient()} rounded-full`}
              />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
