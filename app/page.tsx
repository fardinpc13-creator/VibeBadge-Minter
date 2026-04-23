import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { BadgeGallery } from "@/components/BadgeGallery";
import { MintSection } from "@/components/MintSection";
import { MyBadges } from "@/components/MyBadges";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-900 cyber-grid">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #ff00a8 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #bf00ff 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <BadgeGallery />
        <MintSection />
        <MyBadges />
        <Footer />
      </div>
    </main>
  );
}
