import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Building2,
  Users,
  TrendingUp,
  Award,
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart,
  ChevronRight,
  Mail,
  PhoneCall
} from "lucide-react";
import { SUBSCRIPTION_PLANS, INVESTOR_MARKET_DATA } from "../data/presetData";

import { Language, translations } from "../utils/i18n";

interface InvestorHubProps {
  investorMode: boolean;
  lang?: Language;
}

export const InvestorHub: React.FC<InvestorHubProps> = ({ investorMode, lang = "zh-CN" }) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Pitch Header Banner */}
      <div className="bg-[#080808] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF88]/5 rounded-full filter blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#00FF88]" />
            創辦合夥人：香港教育界 30 年 IT 高層領航
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight uppercase">
            EduBridge HK (港適應) <br />
            <span className="text-[#00FF88]">
              新移民學童升學與 HKDSE 多智能體 AI 平台
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            針對每年逾 45,000 名來港新移民中學生的語言適應與 DSE 考評局高分需求。打造可訂閱式 (Subscription-based SaaS) 雙引擎：Phase 1 隨身即影即學語音知識庫 + Phase 2 DSE Paper 4 多智能體小組討論模擬器。
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => setShowContactModal(true)}
              className="px-6 py-3 bg-[#00FF88] hover:bg-[#00e67a] text-black font-black uppercase tracking-wider rounded-lg shadow-lg transition-all flex items-center gap-2 text-xs"
            >
              預約香港學校/投資人商業演示 (Pitch Demo) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Market Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-2">
          <span className="text-[10px] font-black text-[#00FF88] uppercase tracking-widest block">
            TAM (香港中學及升學市場)
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">{INVESTOR_MARKET_DATA.tamHongKong}</h3>
          <p className="text-xs text-white/50">涵蓋全港 500+ 所中學及新移民家長補習訂閱市場</p>
        </div>

        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-2">
          <span className="text-[10px] font-black text-[#00FF88] uppercase tracking-widest block">
            每年新增目標用戶 (Target SAM)
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">45,000+ 人 / 年</h3>
          <p className="text-xs text-white/50">{INVESTOR_MARKET_DATA.targetAudienceStats}</p>
        </div>

        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-2">
          <span className="text-[10px] font-black text-[#00FF88] uppercase tracking-widest block">
            商業模型 (SaaS Unit Economics)
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">{INVESTOR_MARKET_DATA.ltvCacRatio}</h3>
          <p className="text-xs text-white/50">香港家長 WhatsApp/WeChat 微信群有機口碑裂變效應</p>
        </div>
      </div>

      {/* Subscription Pricing Section */}
      <div className="bg-[#080808] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-black text-[#00FF88] uppercase tracking-widest bg-[#00FF88]/10 px-3 py-1 rounded border border-[#00FF88]/20">
            Monetization & Subscription Tiers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            靈活強大的 S2B2C 訂閱商業模式
          </h2>
          <p className="text-xs sm:text-sm text-white/50">
            同時覆蓋 C 端學生家長月費/年費與 B 端全港中學 (School Enterprise SaaS) 授權方案
          </p>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center gap-2 bg-black p-1.5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-wider pt-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#00FF88] text-black shadow font-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              按月訂閱 (Monthly)
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-[#00FF88] text-black shadow font-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              按年訂閱 (Annual)
              <span className="bg-white text-black text-[9px] px-1.5 py-0.2 rounded font-black">
                省 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`bg-black border rounded-xl p-8 space-y-6 relative flex flex-col justify-between transition-all ${
                  plan.highlighted
                    ? "border-[#00FF88] shadow-2xl shadow-[#00FF88]/5 ring-1 ring-[#00FF88]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 right-6 bg-[#00FF88] text-black text-[10px] font-black px-3 py-0.5 rounded uppercase tracking-wider shadow">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase">{plan.name}</h3>
                    <p className="text-xs text-white/50 mt-1">{plan.tagline}</p>
                  </div>

                  <div className="border-t border-b border-white/10 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white uppercase tracking-tight">
                        {price === 0 ? "HK$ 0" : `HK$ ${price.toLocaleString()}`}
                      </span>
                      <span className="text-xs text-white/40">
                        {price === 0 ? "永遠免費" : billingCycle === "annual" ? "/ 年" : "/ 月"}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#00FF88] font-black uppercase tracking-wider block mt-1">
                      Target: {plan.targetAudience}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-white/70">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setShowContactModal(true)}
                  className={`w-full py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all shadow-lg mt-6 ${
                    plan.highlighted
                      ? "bg-[#00FF88] hover:bg-[#00e67a] text-black"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scalability Roadmap */}
      <div className="bg-[#080808] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/10 pb-4">
          <TrendingUp className="w-6 h-6 text-[#00FF88]" />
          擴展性路線圖 (Platform Scalability & Product Roadmap)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INVESTOR_MARKET_DATA.scalabilityRoadmap.map((step, idx) => (
            <div
              key={idx}
              className="p-5 bg-black border border-white/10 rounded-xl space-y-2 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 text-[#00FF88] border border-white/10 flex items-center justify-center font-black shrink-0 text-sm">
                0{idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-semibold pt-1">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Pitch Demo Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#080808] border border-white/10 rounded-2xl p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-black text-lg text-white uppercase tracking-tight">預約投資人 / 香港學校 Demo 展示</h3>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setContactSubmitted(false);
                }}
                className="text-white/40 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {contactSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#00FF88] mx-auto" />
                <h4 className="font-black text-base text-white uppercase">預約訊息已成功發送！</h4>
                <p className="text-xs text-white/50">
                  我們的團隊與教育顧問將於 24 小時內聯絡閣下，安排實體或線上系統展示。
                </p>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-6 py-2 bg-[#00FF88] text-black font-black uppercase text-xs rounded-lg mt-2"
                >
                  返回平台
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-white/70 font-black uppercase tracking-wider block mb-1">機構 / 學校名稱：</label>
                  <input
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="例：拔萃男書院 / 教育基金投資人"
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#00FF88]"
                  />
                </div>

                <div>
                  <label className="text-white/70 font-black uppercase tracking-wider block mb-1">聯絡電郵 / WhatsApp：</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@school.edu.hk"
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#00FF88]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00FF88] hover:bg-[#00e67a] text-black font-black uppercase tracking-wider rounded-lg shadow-lg transition-all"
                >
                  確認發送預約
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
