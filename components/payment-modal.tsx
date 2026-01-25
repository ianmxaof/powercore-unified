"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Wallet, Bitcoin, Zap, Check, Shield,
  ArrowRight, ChevronRight, Loader2, X, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Payment method types
type PaymentMethod = "stripe" | "x402" | "crypto" | "credits";

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: any;
  available: boolean;
  badge?: string;
  fees?: string;
  gradient: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "stripe",
    name: "Card Payment",
    description: "Pay with credit or debit card via Stripe",
    icon: CreditCard,
    available: true,
    fees: "2.9% + $0.30",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    id: "x402",
    name: "x402 Micropayment",
    description: "HTTP 402 protocol for instant micropayments",
    icon: Zap,
    available: true,
    badge: "New",
    fees: "0.1%",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    description: "Pay with ETH, SOL, or USDC",
    icon: Bitcoin,
    available: true,
    badge: "Popular",
    fees: "Gas only",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "credits",
    name: "PowerCore Credits",
    description: "Use your platform credits balance",
    icon: Wallet,
    available: true,
    gradient: "from-violet-500 to-purple-500",
  },
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    price: number;
    type: "agent" | "skill" | "subscription";
  };
  onPaymentComplete: (method: PaymentMethod) => void;
}

export function PaymentModal({ isOpen, onClose, item, onPaymentComplete }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"select" | "confirm" | "processing" | "success">("select");

  // Mock user credits balance
  const userCredits = 150;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep("confirm");
  };

  const handlePayment = async () => {
    setStep("processing");
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setStep("success");

    // Callback after success
    setTimeout(() => {
      onPaymentComplete(selectedMethod!);
    }, 1500);
  };

  const handleBack = () => {
    setSelectedMethod(null);
    setStep("select");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#12121a] rounded-2xl border border-white/10 w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Complete Purchase</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-gray-400">{item.name}</span>
              <span className="text-2xl font-bold">${item.price}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Payment Method */}
              {step === "select" && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm text-gray-400 mb-4">Select payment method</h3>
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => option.available && handleMethodSelect(option.id)}
                      disabled={!option.available}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        option.available
                          ? "border-white/10 hover:border-violet-500/50 hover:bg-white/5"
                          : "border-white/5 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center`}>
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.name}</span>
                          {option.badge && (
                            <Badge className="text-xs bg-violet-500/20 text-violet-400 border-violet-500/30">
                              {option.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{option.description}</p>
                        {option.fees && (
                          <p className="text-xs text-gray-500 mt-1">Fees: {option.fees}</p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </button>
                  ))}

                  {/* Credits Balance */}
                  <div className="mt-4 p-3 bg-white/5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-violet-400" />
                      <span className="text-sm text-gray-400">Your Credits Balance</span>
                    </div>
                    <span className="font-semibold">${userCredits}</span>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Confirm Payment */}
              {step === "confirm" && selectedMethod && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back
                  </button>

                  {/* Selected Method */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    {(() => {
                      const method = paymentOptions.find((m) => m.id === selectedMethod)!;
                      return (
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.gradient} flex items-center justify-center`}>
                            <method.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-gray-400">{method.description}</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{item.name}</span>
                      <span>${item.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Platform fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${item.price}</span>
                    </div>
                  </div>

                  {/* Crypto-specific UI */}
                  {selectedMethod === "crypto" && (
                    <div className="mb-6 space-y-3">
                      <h4 className="text-sm font-medium">Select Currency</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {["ETH", "SOL", "USDC"].map((currency) => (
                          <button
                            key={currency}
                            className="p-3 rounded-lg border border-white/10 hover:border-violet-500/50 text-center transition-all"
                          >
                            <span className="font-medium">{currency}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* x402 info */}
                  {selectedMethod === "x402" && (
                    <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-400 mt-0.5" />
                        <div className="text-sm text-amber-200">
                          x402 enables instant micropayments. Your browser wallet will prompt for approval.
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handlePayment}
                    className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Confirm Payment
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    Secure payment processed by PowerCore
                  </p>
                </motion.div>
              )}

              {/* Step 3: Processing */}
              {step === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <Loader2 className="w-12 h-12 mx-auto text-violet-400 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
                  <p className="text-gray-400">Please wait while we confirm your payment...</p>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                  <p className="text-gray-400 mb-6">
                    {item.name} has been added to your account.
                  </p>
                  <Button onClick={onClose} variant="outline" className="border-white/20">
                    Close
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook for payment integration
export function usePayment() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentItem, setPaymentItem] = useState<{
    name: string;
    price: number;
    type: "agent" | "skill" | "subscription";
  } | null>(null);

  const initiatePayment = (item: typeof paymentItem) => {
    setPaymentItem(item);
    setIsPaymentModalOpen(true);
  };

  const closePayment = () => {
    setIsPaymentModalOpen(false);
    setPaymentItem(null);
  };

  return {
    isPaymentModalOpen,
    paymentItem,
    initiatePayment,
    closePayment,
  };
}
