"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TabNav } from "@/components/TabNav";
import { Footer } from "@/components/Footer";
import { PaymentClaimModal } from "@/components/PaymentClaimModal";

export default function Home() {
  const [paymentData, setPaymentData] = useState<{ amount: string; note: string } | null>(null);

  useEffect(() => {
    // Detect payment link params
    const params = new URLSearchParams(window.location.search);
    const amount = params.get("amount");
    const note   = params.get("note") ?? "";
    if (amount) setPaymentData({ amount, note });
  }, []);

  return (
    <main className="min-h-screen bg-dark-900 cyber-grid">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle,#00f5ff 0%,transparent 70%)" }}/>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle,#7000ff 0%,transparent 70%)" }}/>
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-6"
          style={{ background: "radial-gradient(circle,#ff00a8 0%,transparent 70%)" }}/>
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <TabNav />
        <Footer />
      </div>

      {paymentData && (
        <PaymentClaimModal
          amount={paymentData.amount}
          note={paymentData.note}
          onClose={() => {
            setPaymentData(null);
            window.history.replaceState({}, "", "/");
          }}
        />
      )}
    </main>
  );
}
