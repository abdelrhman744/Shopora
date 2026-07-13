import Link from "next/link";
import { Zap } from "lucide-react";
import GradientText from "./GradientText";
import { GRADIENT_BTN } from "@/lib/theme";
import Image from "next/image";

const FOOTER_COLUMNS = [
  { title: "Shop", links: ["All Products", "New Arrivals"] },
  { title: "Company", links: ["About Us","Contact"] },
];

export default function Footer() {
  return (
    <footer
      className="px-6 lg:px-12 py-16"
      style={{ background: "#11131B", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={150}
                  height={50}
                  priority
                />
              </div>
              <span className="text-lg font-black text-white">
                SHOP
                <GradientText>ORA</GradientText>
              </span>
            </div>
            <p className="text-sm text-[#8D93A5] leading-relaxed">
              Premium tech for the next generation. Curated. Verified. Delivered.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <button className="text-sm text-[#8D93A5] hover:text-white transition-colors">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs text-[#8D93A5]">© 2026 SHOPORA.io. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <button key={l} className="text-xs text-[#8D93A5] hover:text-white transition-colors">
                {l}
              </button>
            ))}
            <Link href="/admin/login" className="text-xs text-[#8D93A5] hover:text-white transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}