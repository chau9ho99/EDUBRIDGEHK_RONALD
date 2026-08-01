import React, { useState } from "react";
import {
  X,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Building2,
  Crown,
  CreditCard,
  Lock,
  Smartphone,
  Apple
} from "lucide-react";
import { Language } from "../utils/i18n";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const isZhCN = lang === "zh-CN";
  const isZhHK = lang === "zh-HK";

  const getText = (zhHKText: string, zhCNText: string, enText: string) => {
    if (isZhCN) return zhCNText;
    if (isZhHK) return zhHKText;
    return enText;
  };

  const handleSelectPlan = (planTitle: string) => {
    setSelectedPlan(planTitle);
    setCheckoutSuccess(planTitle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0c0d12] border-2 border-[#00FF88]/40 rounded-3xl max-w-4xl w-full p-5 sm:p-8 text-white shadow-[0_0_60px_rgba(0,255,136,0.25)] relative my-auto overflow-hidden">
        {/* Glowing Background FX */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00FF88]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 text-[#00FF88] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-[#00FF88]/30 mb-3">
            <Sparkles className="w-4 h-4 text-[#00FF88]" />
            <span>{getText("EduBridge HK • 靈活訂閱計劃", "EduBridge HK • 灵活订阅计划", "EduBridge HK • Subscription Plans")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {getText("解鎖全方位 AI 英語學習系統", "解锁全方位 AI 英语学习系统", "Unlock Full AI Language Learning Suite")}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mt-2">
            {getText(
              "專為香港中學生與 DSE 考生量身打造，AI 賦能克服全英文授課與 Paper 4 奪星",
              "专为香港中学生与 DSE 考生量身打造，AI 赋能克服全英文授课与 Paper 4 夺星",
              "Tailored for Hong Kong secondary students and HKDSE candidates to master EMI classrooms & Paper 4 Oral"
            )}
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center bg-white/5 border border-white/15 p-1 rounded-2xl mt-5">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                billingCycle === "monthly"
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {getText("按月訂閱", "按月订阅", "Monthly Billing")}
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]"
                  : "text-[#00FF88] hover:text-white"
              }`}
            >
              <span>{getText("按年訂閱", "按年订阅", "Annual Billing")}</span>
              <span className="bg-black/80 text-[#00FF88] text-[10px] font-black px-2 py-0.5 rounded-full">
                {getText("省 20%", "省 20%", "Save 20%")}
              </span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {checkoutSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-[#00FF88]/15 border border-[#00FF88]/40 text-[#00FF88] text-xs sm:text-sm font-bold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>
                {getText(
                  `🎉 已開通 [${checkoutSuccess}] 7 天免費試用！所有高級 AI 功能已即時生效。`,
                  `🎉 已开通 [${checkoutSuccess}] 7 天免费试用！所有高级 AI 功能已即时生效。`,
                  `🎉 [${checkoutSuccess}] 7-day free trial activated! All premium AI features are now enabled.`
                )}
              </span>
            </div>
            <button
              onClick={() => setCheckoutSuccess(null)}
              className="text-white/60 hover:text-white text-xs underline"
            >
              {getText("關閉", "关闭", "Close")}
            </button>
          </div>
        )}

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Card 1: Standard Plan */}
          <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all hover:bg-white/[0.07]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30">
                  {getText("月度標準版", "月度标准版", "Standard Monthly")}
                </span>
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs text-white/60 mb-4">
                {getText("適合適應期中學生，隨手拍課本與影子跟讀正音", "适合适应期中学生，随手拍课本与影子跟读正音", "Ideal for students adapting to EMI & daily pronunciation")}
              </p>
              <div className="mb-5">
                <span className="text-3xl font-black text-white">
                  {billingCycle === "annual" ? "HK$ 78" : "HK$ 98"}
                </span>
                <span className="text-xs text-white/50 ml-1">/ {getText("月", "月", "mo")}</span>
                {billingCycle === "annual" && (
                  <p className="text-[10px] text-blue-400 mt-1">
                    {getText("按年結算 HK$ 936/年 (原價 HK$ 1,176)", "按年结算 HK$ 936/年 (原价 HK$ 1,176)", "Billed HK$ 936/yr")}
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-4 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("無限次 隨手拍 OCR 課本/講義解析", "无限次 随手拍 OCR 课本/讲义解析", "Unlimited Snap & Learn textbook OCR")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("0.8x 慢速聽力對齊與影子跟讀正音", "0.8x 慢速听力对齐与影子跟读正音", "0.8x slow speed audio & shadowing coach")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("個人 DSE 生詞庫與 3D 間隔記憶卡", "个人 DSE 生词库与 3D 间隔记忆卡", "Personal DSE vocab bank & spaced repetition cards")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("三語 (英/粵/普) 界面與導師釋義", "三语 (英/粤/普) 界面与导师释义", "Trilingual (EN/Cantonese/Mandarin) support")}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(getText("月度標準版", "月度标准版", "Standard Plan"))}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider transition-all border border-white/20 active:scale-95"
            >
              {getText("免費試用 7 天", "免费试用 7 天", "Start 7-Day Free Trial")}
            </button>
          </div>

          {/* Card 2: Pro Sprint Plan (Popular Choice) */}
          <div className="bg-gradient-to-b from-[#00FF88]/15 via-black/80 to-purple-900/30 border-2 border-[#00FF88] rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all shadow-[0_0_30px_rgba(0,255,136,0.2)] relative scale-100 md:scale-[1.03] z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00FF88] text-black text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3 text-black" />
              <span>{getText("DSE 備考熱選 • POPULAR", "DSE 备考热选 • POPULAR", "DSE PRO CHOICE")}</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="text-xs font-black uppercase text-[#00FF88] bg-[#00FF88]/10 px-2.5 py-1 rounded-lg border border-[#00FF88]/30">
                  {getText("DSE 衝刺專業版", "DSE 冲刺专业版", "DSE Pro Sprint")}
                </span>
                <Sparkles className="w-5 h-5 text-[#00FF88]" />
              </div>
              <p className="text-xs text-white/70 mb-4">
                {getText("適合 S4-S6 考生，解鎖 4人 AI 口試對練與 5** 診斷", "适合 S4-S6 考生，解锁 4人 AI 口试对练与 5** 诊断", "Best for DSE candidates needing 4-candidate Paper 4 practice")}
              </p>
              <div className="mb-5">
                <span className="text-3xl font-black text-[#00FF88]">
                  {billingCycle === "annual" ? "HK$ 158" : "HK$ 198"}
                </span>
                <span className="text-xs text-white/50 ml-1">/ {getText("月", "月", "mo")}</span>
                {billingCycle === "annual" && (
                  <p className="text-[10px] text-[#00FF88] mt-1 font-bold">
                    {getText("按年結算 HK$ 1,896/年 (原價 HK$ 2,376)", "按年结算 HK$ 1,896/年 (原价 HK$ 2,376)", "Billed HK$ 1,896/yr")}
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-white/90 border-t border-white/10 pt-4 mb-6">
                <li className="flex items-start gap-2 font-bold text-white">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("包含「標準版」所有功能", "包含「标准版」所有功能", "Includes all Standard features")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("無限次 4 人 AI 小組口試角色擬真對練", "无限次 4 人 AI 小组口试角色拟真对练", "Unlimited 4-candidate AI DSE Paper 4 mock exams")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("考評局 5** 考官級 Rubric 診斷報告", "考评局 5** 考官级 Rubric 诊断报告", "HKEAA 5** examiner rubric assessment reports")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("DSE 30年歷屆話題試題庫 & 5** 範文庫", "DSE 30年历届话题试题库 & 5** 范文库", "30-year HKDSE past topics & 5** essay bank")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("AI 專屬個人導師 24/7 即時答疑", "AI 专属个人导师 24/7 即时答疑", "24/7 AI tutor for instant grammar & essay advice")}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(getText("DSE 衝刺專業版", "DSE 冲刺专业版", "DSE Pro Sprint"))}
              className="w-full py-3 px-4 rounded-xl bg-[#00FF88] hover:bg-[#00FF88]/90 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,255,136,0.4)] active:scale-95"
            >
              {getText("立即體驗 (7 天免費)", "立即体验 (7 天免费)", "Subscribe Now (7 Days Free)")}
            </button>
          </div>

          {/* Card 3: School / Enterprise Plan */}
          <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all hover:bg-white/[0.07]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30">
                  {getText("學校 / 機構團體版", "学校 / 机构团体版", "School & Enterprise")}
                </span>
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xs text-white/60 mb-4">
                {getText("適用於香港中學、補習社及新移民服務中心", "适用于香港中学、补习社及新移民服务中心", "Tailored for HK secondary schools & tutoring centers")}
              </p>
              <div className="mb-5">
                <span className="text-2xl font-black text-white">
                  {getText("聯繫團隊客製", "联系团队客制", "Custom Quote")}
                </span>
                <p className="text-[10px] text-purple-300 mt-1">
                  {getText("全校 S1-S6 批量帳號優惠", "全校 S1-S6 批量账号优惠", "Bulk student licenses for S1-S6")}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-4 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("全校/全班學生批量帳號授權", "全校/全班学生批量账号授权", "School-wide student license distribution")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("教師後台數據看板 (掌握學生學習進度)", "教师后台数据看板 (掌握学生学习进度)", "Teacher analytics dashboard & student tracking")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("專屬校園詞庫與 DSE 擬真考場客製化", "专属校园词库与 DSE 拟真考场客制化", "Custom school curriculum & mock exam alignment")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                  <span>{getText("專屬客戶經理與校園現場培訓支援", "专属客户经理与校园现场培训支援", "Dedicated account manager & on-site staff training")}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(getText("學校/機構團體版", "学校/机构团体版", "School Plan"))}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all border border-purple-400 active:scale-95"
            >
              {getText("聯繫學校合作", "联系学校合作", "Contact Sales")}
            </button>
          </div>
        </div>

        {/* Trusted Payment Gateways & Mobile App Badges */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/5">
          {/* Payment Options */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white/80">
              <Lock className="w-4 h-4 text-[#00FF88]" />
              <span>{getText("支援香港主流安全支付方式 (256-bit SSL 加密)", "支持香港主流安全支付方式 (256-bit SSL 加密)", "Secure Payment via Hong Kong Gateway (256-bit SSL)")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
              <span className="px-2.5 py-1 bg-white/10 rounded-lg font-black border border-white/10 flex items-center gap-1 text-[11px]">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Visa / Mastercard
              </span>
              <span className="px-2.5 py-1 bg-white/10 rounded-lg font-black border border-white/10 flex items-center gap-1 text-[11px]">
                <Apple className="w-3.5 h-3.5 text-white" /> Apple Pay
              </span>
              <span className="px-2.5 py-1 bg-white/10 rounded-lg font-black border border-white/10 text-[11px]">
                🤖 Google Pay
              </span>
              <span className="px-2.5 py-1 bg-[#00FF88]/20 text-[#00FF88] rounded-lg font-black border border-[#00FF88]/30 text-[11px]">
                ⚡ FPS 轉數快
              </span>
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-lg font-black border border-blue-500/30 text-[11px]">
                💙 AlipayHK 支付寶
              </span>
              <span className="px-2.5 py-1 bg-green-500/20 text-green-300 rounded-lg font-black border border-green-500/30 text-[11px]">
                🟢 WeChat Pay 微信
              </span>
            </div>
          </div>

          {/* App Store & Google Play Coming Soon Badges */}
          <div className="flex flex-col md:flex-row gap-3 shrink-0 items-center justify-center md:justify-end">
            <img
              src="/assets/IMG/ICON/iOS_Android.png"
              alt="iOS & Android"
              className="h-9 sm:h-10 object-contain rounded-lg hover:scale-105 transition-transform"
            />
            <img
              src="/assets/IMG/ICON/App_Store_badge.png"
              alt="App Store (Coming Soon)"
              className="h-9 sm:h-10 object-contain rounded-lg hover:scale-105 transition-transform"
            />
            <img
              src="/assets/IMG/ICON/Google_Play_badge.png"
              alt="Google Play (Coming Soon)"
              className="h-9 sm:h-10 object-contain rounded-lg hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
