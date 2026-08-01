export type Language = "zh-CN" | "zh-HK" | "en";

export const translations = {
  "zh-CN": {
    // Navbar
    appTitle: "EduBridge",
    appSubTitle: "HKDSE 语音伴学与多智能体讨论平台",
    topBanner: "🎉 专为新移民学生设计的 HKDSE 升学与校园适应 AI 平台",
    investorModeOn: "投资人展示模式 ON",
    investorModeOff: "切换投资人展示模式",
    tabHome: "🏠 功能主頁",
    backToHome: "← 返回主頁選單 (Home Hub)",
    hubTitle: "EduBridge HK • 核心功能快捷入口",
    hubSub: "點擊下方大型卡片，進入 Step-by-Step 專注學習與對練模組",
    tabSnap: "即影即學 / 語音隨筆",
    tabDiscussion: "DSE 多智能体口试",
    tabKnowledge: "个人知识库/错题库",
    tabInvestor: "订阅与投资人专区",
    langSelect: "界面语言",

    // Interactive Landing
    landingSectionTitle: "EduBridge HK 核心平台与功能演示 (点击收起 / 展开)",
    collapse: "收起",
    expand: "展开",
    landingBadge: "EduBridge HK • 专为香港新移民中学生设计的 AI 升学与语言平台",
    landingMainTitle: "克服 EMI 英文中学适应焦虑",
    landingMainSubtitle: "HKDSE 升学与全英文校 universal 适应 AI 伴学平台",
    landingDesc: "拍照即刻 OCR 提取课本与学校通告，0.8x 慢速英式正音朗读拆解、4人 AI 小组口试模拟与 DSE 5** 生词库，协助迅速融入香港二次教育！",
    snapLearnBtn: "📸 立即体验即影即学 (Snap & Learn)",
    generateDseBtn: "✨ AI 一键生成 DSE 范文短文",
    videoDemoTitle: "核心功能视频演示 (点击切换观看)",
    tapToWatch: "点击卡片观看视频示范",

    // Card 1
    card1Badge: "🏆 核心王牌",
    card1Title: "1. 即影即学 (Snap & Learn)",
    card1Sub: "拍照/上传课本即刻 OCR 提取",
    card1Desc: "拍下英文课本、练习卷或学校通告，AI 即刻进行多模态 OCR 提取，标示 DSE Level 5* 高频生词与句型！",

    // Card 2
    card2Badge: "🎧 0.8x 正音朗读",
    card2Title: "2. 0.8x 英式慢速正音",
    card2Sub: "专为 EMI 全英文中学适应而设",
    card2Desc: "纯正英式与美式发音，搭配 0.8x 慢速模式与连读拆解，帮助新移民学生听懂全英文授课，克服课堂听力恐惧！",

    // Card 3
    card3Badge: "🗣️ PAPER 4 考场",
    card3Title: "3. DSE 4人 AI 小组口试",
    card3Sub: "Paper 4 真实多智能体演练",
    card3Desc: "Candidate A, B, C 角色化多智能体实时对答陪练，AI 考官依据考评局标准生成 5** Rubric 成绩诊断报告！",

    // Card 4
    card4Badge: "🧠 智能闪卡",
    card4Title: "4. 个人错题生词库",
    card4Sub: "自动归档与间隔重复复习",
    card4Desc: "所有扫描过的课文、高频 DSE 生词与语法错题自动归档至 Knowledge Base，支持手机端智能闪卡高效复习！",

    listenNarration: "听 0.8x 英式导览",
    stopNarration: "停止播放",

    // Snap & Learn
    snapTitle: "即影即学 & 语音随笔助手",
    snapSubtitle: "拍摄教科书、香港学校通告或输入英文段落，AI 即时提供原声朗读与 DSE 考题拆解",
    modePreset: "示范范本",
    modeText: "复制文字",
    modeUpload: "上传照片",
    selectPresetLabel: "⚡ 快速体验香港 Secondary School 经典示范范本：",
    singlePresetNotice: "精简展示范本",
    passageLoaded: "已加载课文",
    snapLearnFeature: "🏆 拍照即学 (Winning Feature)",
    fullScreenFocusMode: "全屏专注【即影即学】 Mode",
    openFullScreenSnap: "📸 开启全屏【即影即学】(Mobile 专注模式)",
    exitFullScreen: "✕ 退出全屏",
    mobileScanHint: "随时拍摄/上传英文课文或通告，AI 即时开启卡拉 OK 0.8x 朗读与 DSE 词汇解析！",
    aiGenerateNewArticle: "✨ AI 一键生成新短文 / 随机课文",
    generatingArticle: "AI 正在创作全新 DSE 考试短文与词汇...",
    pasteTextPlaceholder: "在此粘贴任何英文课文、DSE 练习题目或香港学校通告内文...",
    startAnalysis: "开始 AI 语音与 DSE 考题解析",
    analyzing: "Gemini AI 正在进行 DSE 词汇与发音分析...",
    uploadTitle: "点击上传或拖放教科书照片 / 课业截图",
    uploadSubtitle: "支持 JPG, PNG 格式",
    reselectPhoto: "点击可重新选择照片",
    startOcr: "开始 OCR 照片解析",
    ocrAnalyzing: "AI 正在进行影像 OCR 与多模态解析...",
    directOcrTitle: "Direct OCR 文本框 (即时提取英文课文，直接加载英语朗读 Engine)",
    startOcrAnalysis: "开始 English DSE OCR 与智能分析",
    focusCameraShot: "📸 手机镜头即拍",
    focusUploadFile: "🖼️ 上传照片文件",
    focusPastePassage: "📝 粘贴课文段落",
    focusCollapsePaste: "收起粘贴框 ▲",
    focusPasteTitle: "粘贴或输入英文课文段落 (Paste / Edit Study Passage)",
    focusPastePlaceholder: "请在此处粘贴英文课文段落、DSE 考题或通告文字...",
    focusStartAiAnalysis: "🚀 开始 AI 分析与朗读",
    focusEditPassage: "✏️ 编辑 / 粘贴课文",
    focusDoneEditing: "完成编辑",
    focusActiveTextHeader: "课文内容 (Active Text)",
    focusSyncNotice: "✓ 内容已实时同步，可即时进行 0.8x 慢速朗读或跟读诊断",
    focusSaveLock: "保存并锁定文字",
    focusFabLabel: "即影即学 Mode",
    focusEditTextPlaceholder: "可在此直接修改、剪贴或输入课文...",
    closeLabel: "✕ 关闭",
    investorSnapPitchTitle: "投资人展示亮点 (Phase 1: 即影即学与随身语音知识库 Engine)",
    investorSnapPitchDesc: "针对新移民学生「随时随地遇到英/粤语障碍」的痛点。学生只需拍一张照或 Copy 一段课文，系统即时进行多模态 OCR 解析、生成纯正英语语音朗读、拆解 DSE 考评局评分等级词汇 (Level 3-5**)，并自动储存至个人的 Knowledge Base。",

    // Speech Player
    speechEngineTitle: "纯正英语朗读 Engine (TTS)",
    speechEngineSub: "慢速与正音模式，协助适应香港英文中学教学",
    speechSpeedLabel: "语速:",
    slowSpeed: "0.8x 慢速",
    playSpeech: "立即以纯正英语朗读",
    stopSpeech: "停止播放朗读",
    speechScriptEditable: "✏️ 朗读文本 (可直接点击编辑、粘贴任意英文课文)",
    playAudioTip: "💡 点击“播放朗读”即可听到纯正 0.8x 英式/美式发音，并开启卡拉 OK 红色高亮！",
    karaokeTitle: "🎤 卡拉 OK 实时红字高亮朗读 Mode",
    karaokeReadingHint: "🔥 正在以 0.8x 慢速正音朗读，当前发音单词已为您实时标红高亮！",
    readPronunciation: "读发音",
    accentUs: "美式英语 (US)",
    accentUk: "英式英语 (UK/HK)",
    accentCantonese: "粤语朗读 (zh-HK)",
    accentMandarin: "普通话朗读 (zh-CN)",

    // Shadowing & Pronunciation AI Coach
    shadowCoachTitle: "🎙️ AI 跟读跟练 & 实时发音诊断 (AI Shadowing Coach)",
    shadowCoachSub: "专为 HKDSE Paper 4 口语及新移民英语发音研发，支持实时录音、AI 正音评分与声调诊治",
    demoTag: " [Interactive Demo / 原型演示]",
    demoNotice: "⚠️ 提示：当前为前端 UI 原型演示模式 (Interactive Prototype Demo)。真实麦克风录音与回放功能已开启！评分界面为功能规划展示，完整生产版将接入 Gemini Audio Multimodal API 实施实时音标 (IPA) 精准对齐与扣分诊断。",
    startRecording: "🎙️ 开始跟读录音",
    recordingInProgress: "🔴 正在录音中...请跟读上方英文段落",
    stopRecording: "⏹️ 完成跟读，立即进行 AI 正音评分",
    evaluatingAudio: "⚡ Gemini AI 正在分析音频，维度包括音标、重音与流利度...",
    overallScore: "DSE 口语发音总分",
    accuracyScore: "音标发音准确度",
    fluencyScore: "朗读流利度",
    intonationScore: "DSE 语调与重音",
    playMyRecording: "🎧 播放我的跟读录音",
    aiFeedbackTitle: "💡 AI 导师发音优缺诊治与音标纠偏提示：",
    investorShadowingNote: "🏆 EduBridge HK 独家 Multi-Agent Speech Evaluation Engine（专为香港新移民学童克服 HKDSE Paper 4 口语发音瓶颈設計）",

    // Vocabulary Section
    vocabTitle: "文章高频 DSE 考评局等级单字 (Level 3 - Level 5**)",
    vocabCount: "个高阶词汇",
    generateMoreVocab: "✨ AI 补充生成更多高频 DSE 考题词汇",
    generatingVocab: "AI 正在分析并生成更多 DSE 词汇...",
    dseExample: "DSE 文章范例:",
    saveToKb: "存入生词本 (Knowledge Base)",
    savedToKb: "已保存至生词本",

    // AI Tutor
    aiTutorTitle: "AI 语音互动导师",
    aiTutorSub: "针对此段文章发问语法、发音或 DSE 答题技巧",
    tutorWelcome: "Hello! I am your EduBridge AI English Tutor. I have loaded this passage for you! Feel free to ask me anything about HKDSE grammar, Level 5* vocabulary, pronunciation tips, or practice speaking with me in English!",
    readAloudAnswer: "🔊 朗读回答",
    thinkingReply: "AI 导师正在思考解答中...",
    commonPrompts: "常问 DSE 考题提示：",
    chatPlaceholder: "输入问题或语音发问...",

    // Knowledge Base
    kbTitle: "个人知识库 & 学习纪录",
    kbSub: "收录所有扫描课文、DSE 词汇与练习纪录",
    searchPlaceholder: "搜索标签、关键字或标题...",
    allTags: "全部标签",
    flashcardTitle: "DSE 生词智能闪卡 (Smart Vocab Flashcard)",
    showFront: "点击切换为正面 (Word)",
    showBack: "点击翻牌查看中文释义与 DSE 例句",
    prevWord: "← 上一个单字",
    nextWord: "下一个单字 →",
    readArticleAudio: "语音朗读",
    deleteAll: "清空全部记录",
    deleteConfirm: "确定要清空所有个人知识库与扫描历史纪录吗？",
    deleteSingle: "删除此记录",
    deleteSingleConfirm: "确定删除此条记录吗？",
    emptyHistory: "暂无扫描历史记录",

    // Investor / Subscription
    investorTitle: "EduBridge HK (港适应) 新移民学童升学与 HKDSE 多智能体 AI 平台",
    investorSub: "针对每年逾 45,000 名来港新移民中学生的语言适应与 DSE 考评局高分需求。",
    bookDemo: "预约香港学校/投资人商业演示 (Pitch Demo)",
    monthly: "按月订阅 (Monthly)",
    annual: "按年订阅 (Annual)",
    save20: "省 20%",
  },

  "zh-HK": {
    // Navbar
    appTitle: "EduBridge",
    appSubTitle: "HKDSE 語音伴學與多智能體討論平台",
    topBanner: "🎉 專為新移民學生設計的 HKDSE 升學與校園適應 AI 平台",
    investorModeOn: "投資人展示模式 ON",
    investorModeOff: "切換投資人展示模式",
    tabHome: "🏠 功能主頁",
    backToHome: "← 返回主頁選單 (Home Hub)",
    hubTitle: "EduBridge HK • 核心功能快捷入口",
    hubSub: "點選下方大型卡片，進入 Step-by-Step 專注學習與對練模組",
    tabSnap: "即影即學 / 語音隨筆",
    tabDiscussion: "DSE 多智能體口試",
    tabKnowledge: "個人知識庫/錯題庫",
    tabInvestor: "訂閱與投資人專區",
    langSelect: "界面語言",

    // Interactive Landing
    landingSectionTitle: "EduBridge HK 核心平台與功能演示 (點擊收起 / 展開)",
    collapse: "收起",
    expand: "展開",
    landingBadge: "EduBridge HK • 專為香港新移民中學生設計的 AI 升學與語言平台",
    landingMainTitle: "克服 EMI 英文中學適應焦慮",
    landingMainSubtitle: "HKDSE 升學與全英文校園適應 AI 伴學平台",
    landingDesc: "拍照即刻 OCR 提取課本與學校通告，0.8x 慢速英式正音朗讀拆解、4人 AI 小組口試模擬與 DSE 5** 生詞庫，協助迅速融入香港中學教育！",
    snapLearnBtn: "📸 立即體驗即影即學 (Snap & Learn)",
    generateDseBtn: "✨ AI 一鍵生成 DSE 範文短文",
    videoDemoTitle: "核心功能視頻演示 (點擊切換觀看)",
    tapToWatch: "點擊卡片觀看視頻示範",

    // Card 1
    card1Badge: "🏆 核心王牌",
    card1Title: "1. 即影即學 (Snap & Learn)",
    card1Sub: "拍照/上傳課本即刻 OCR 提取",
    card1Desc: "拍下英文課本、練習卷或學校通告，AI 即刻進行多模態 OCR 提取，標示 DSE Level 5* 高頻生詞與句型！",

    // Card 2
    card2Badge: "🎧 0.8x 正音朗讀",
    card2Title: "2. 0.8x 英式慢速正音",
    card2Sub: "專為 EMI 全英文中學適應而設",
    card2Desc: "純正英式與美式發音，搭配 0.8x 慢速模式與連讀拆解，幫助新移民學生聽懂全英文授課，克服課堂聽力恐懼！",

    // Card 3
    card3Badge: "🗣️ PAPER 4 考場",
    card3Title: "3. DSE 4人 AI 小組口試",
    card3Sub: "Paper 4 真實多智能體演練",
    card3Desc: "Candidate A, B, C 角色化多智能體實時對答陪練，AI 考官依據考評局標準生成 5** Rubric 成績診斷報告！",

    // Card 4
    card4Badge: "🧠 智能閃卡",
    card4Title: "4. 個人錯題生詞庫",
    card4Sub: "自動歸檔與間隔重複複習",
    card4Desc: "所有掃描過的課文、高頻 DSE 生詞與語法錯題自動歸檔至 Knowledge Base，支持手機端智能閃卡高效複習！",

    listenNarration: "聽 0.8x 英式導覽",
    stopNarration: "停止播放",

    // Snap & Learn
    snapTitle: "即影即學 & 語音隨筆助手",
    snapSubtitle: "拍攝教科書、香港學校通告或輸入英文段落，AI 即時提供原聲朗讀與 DSE 考題拆解",
    modePreset: "示範範本",
    modeText: "複製文字",
    modeUpload: "上傳照片",
    selectPresetLabel: "⚡ 快速體驗香港 Secondary School 經典示範範本：",
    singlePresetNotice: "精簡展示範本",
    passageLoaded: "已載入課文",
    snapLearnFeature: "🏆 拍照即學 (Winning Feature)",
    fullScreenFocusMode: "全屏專注【即影即學】 Mode",
    openFullScreenSnap: "📸 開啟全屏【即影即學】(Mobile 專注模式)",
    exitFullScreen: "✕ 退出全屏",
    mobileScanHint: "隨時拍攝/上傳英文課文或通告，AI 即時開啟卡拉 OK 0.8x 朗讀與 DSE 詞彙解析！",
    aiGenerateNewArticle: "✨ AI 一鍵生成新短文 / 隨機課文",
    generatingArticle: "AI 正在創作全新 DSE 考試短文與詞彙...",
    pasteTextPlaceholder: "在此貼上任何英文課文、DSE 練習題目或香港學校通告內文...",
    startAnalysis: "開始 AI 語音與 DSE 考題解析",
    analyzing: "Gemini AI 正在進行 DSE 詞彙與發音分析...",
    uploadTitle: "點擊上傳或拖放教科書照片 / 課業截圖",
    uploadSubtitle: "支持 JPG, PNG 格式",
    reselectPhoto: "點擊可重新選擇照片",
    startOcr: "開始 OCR 照片解析",
    ocrAnalyzing: "AI 正在進行影像 OCR 與多模態解析...",
    directOcrTitle: "Direct OCR 文本框 (即時提取英文課文，直接載入英語朗讀 Engine)",
    startOcrAnalysis: "開始 English DSE OCR 與智能分析",
    focusCameraShot: "📸 手機鏡頭即拍",
    focusUploadFile: "🖼️ 上傳相片檔案",
    focusPastePassage: "📝 貼上課文段落",
    focusCollapsePaste: "收起貼上框 ▲",
    focusPasteTitle: "貼上或輸入英文課文段落 (Paste / Edit Study Passage)",
    focusPastePlaceholder: "請在此處貼上英文課文段落、DSE 考題或通告文字...",
    focusStartAiAnalysis: "🚀 開始 AI 分析與朗讀",
    focusEditPassage: "✏️ 編輯 / 貼上課文",
    focusDoneEditing: "完成編輯",
    focusActiveTextHeader: "課文內容 (Active Text)",
    focusSyncNotice: "✓ 內容已實時同步，可即時進行 0.8x 慢速朗讀或跟讀診斷",
    focusSaveLock: "保存並鎖定文字",
    focusFabLabel: "即影即學 Mode",
    focusEditTextPlaceholder: "可在此直接修改、剪貼或輸入課文...",
    closeLabel: "✕ 關閉",
    investorSnapPitchTitle: "投資人展示亮點 (Phase 1: 即影即學與隨身語音知識庫 Engine)",
    investorSnapPitchDesc: "針對新移民學生「隨時隨地遇到英/粵語障礙」的痛點。學生只需拍一張照或 Copy 一段課文，系統即時進行多模態 OCR 解析、生成純正英語語音朗讀、拆解 DSE 考評局評分等級詞彙 (Level 3-5**)，並自動儲存至個人 Knowledge Base。",

    // Speech Player
    speechEngineTitle: "純正英語朗讀 Engine (TTS)",
    speechEngineSub: "慢速與正音模式，協助適應香港英文中學教學",
    speechSpeedLabel: "語速:",
    slowSpeed: "0.8x 慢速",
    playSpeech: "立即以純正英語朗讀",
    stopSpeech: "停止播放朗讀",
    speechScriptEditable: "✏️ 朗讀文本 (可直接點擊編輯、複製貼上任意英文課文)",
    playAudioTip: "💡 點擊「播放朗讀」即可聽到純正 0.8x 英式/美式發音，並開啟卡拉 OK 紅色高亮！",
    karaokeTitle: "🎤 卡拉 OK 實時紅字高亮朗讀 Mode",
    karaokeReadingHint: "🔥 正在以 0.8x 慢速正音朗讀，當前發音單詞已為您實時標紅高亮！",
    readPronunciation: "讀發音",
    accentUs: "美式英語 (US)",
    accentUk: "英式英語 (UK/HK)",
    accentCantonese: "粵語朗讀 (zh-HK)",
    accentMandarin: "普通話朗讀 (zh-CN)",

    // Shadowing & Pronunciation AI Coach
    shadowCoachTitle: "🎙️ AI 跟讀跟練 & 實時發音診斷 (AI Shadowing Coach)",
    shadowCoachSub: "專為 HKDSE Paper 4 口語及新移民英語發音研發，支援實時錄音、AI 正音評分與聲調診治",
    demoTag: " [Interactive Demo / 原型演示]",
    demoNotice: "⚠️ 提示：目前為前端 UI 原型演示模式 (Interactive Prototype Demo)。真實麥克風錄音與回放功能已開啟！評分介面為功能規劃展示，完整生產版將接駁 Gemini Audio Multimodal API 實施實時音標 (IPA) 精準對齊與扣分診斷。",
    startRecording: "🎙️ 開始跟讀錄音",
    recordingInProgress: "🔴 正在錄音中...請跟讀上方英文段落",
    stopRecording: "⏹️ 完成跟讀，立即進行 AI 正音評分",
    evaluatingAudio: "⚡ Gemini AI 正在分析音訊，維度包括音標、重音與流利度...",
    overallScore: "DSE 口語發音總分",
    accuracyScore: "音標發音準確度",
    fluencyScore: "朗讀流利度",
    intonationScore: "DSE 語調與重音",
    playMyRecording: "🎧 播放我的跟讀錄音",
    aiFeedbackTitle: "💡 AI 導師發音優缺診治與音標糾偏提示：",
    investorShadowingNote: "🏆 EduBridge HK 獨家 Multi-Agent Speech Evaluation Engine（專為香港新移民學童克服 HKDSE Paper 4 口語發音瓶頸設計）",

    // Vocabulary Section
    vocabTitle: "文章高頻 DSE 考評局等級單字 (Level 3 - Level 5**)",
    vocabCount: "個高階詞彙",
    generateMoreVocab: "✨ AI 補充生成更多高頻 DSE 考題詞彙",
    generatingVocab: "AI 正在分析並生成更多 DSE 詞彙...",
    dseExample: "DSE 文章範例:",
    saveToKb: "存入生詞本 (Knowledge Base)",
    savedToKb: "已保存至生詞本",

    // AI Tutor
    aiTutorTitle: "AI 語音互動導師",
    aiTutorSub: "針對此段文章發問語法、發音或 DSE 答題技巧",
    tutorWelcome: "Hello! I am your EduBridge AI English Tutor. I have loaded this passage for you! Feel free to ask me anything about HKDSE grammar, Level 5* vocabulary, pronunciation tips, or practice speaking with me in English!",
    readAloudAnswer: "🔊 朗讀回答",
    thinkingReply: "AI 導師正在思考解答中...",
    commonPrompts: "常問 DSE 考題提示：",
    chatPlaceholder: "輸入問題或用語音發問...",

    // Knowledge Base
    kbTitle: "個人知識庫 & 學習紀錄",
    kbSub: "收錄所有掃描課文、DSE 詞彙與練習紀錄",
    searchPlaceholder: "搜尋標籤、關鍵字或標題...",
    allTags: "全部標籤",
    flashcardTitle: "DSE 生詞智能閃卡 (Smart Vocab Flashcard)",
    showFront: "點擊切換為正面 (Word)",
    showBack: "點擊翻牌查看中文釋義與 DSE 例句",
    prevWord: "← 上一個單字",
    nextWord: "下一個單字 →",
    readArticleAudio: "語音朗讀",
    deleteAll: "清空全部記錄",
    deleteConfirm: "確定要清空所有個人知識庫與掃描歷史紀錄嗎？",
    deleteSingle: "刪除此記錄",
    deleteSingleConfirm: "確定刪除此條記錄嗎？",
    emptyHistory: "暫無掃描歷史記錄",

    // Investor / Subscription
    investorTitle: "EduBridge HK (港適應) 新移民學童升學與 HKDSE 多智能體 AI 平台",
    investorSub: "針對每年逾 45,000 名來港新移民中學生的語言適應與 DSE 考評局高分需求。",
    bookDemo: "預約香港學校/投資人商業演示 (Pitch Demo)",
    monthly: "按月訂閱 (Monthly)",
    annual: "按年訂閱 (Annual)",
    save20: "省 20%",
  },

  "en": {
    // Navbar
    appTitle: "EduBridge",
    appSubTitle: "HKDSE Voice & Multi-Agent Learning Platform",
    topBanner: "🎉 Designed for New Immigrant HK Secondary Students for HKDSE Success",
    investorModeOn: "Investor Pitch ON",
    investorModeOff: "Switch Investor Mode",
    tabHome: "🏠 Main Hub",
    backToHome: "← Back to Main Hub",
    hubTitle: "EduBridge HK • Core Feature Launcher",
    hubSub: "Tap any feature card below for a focused, step-by-step learning experience",
    tabSnap: "Snap & Learn / Voice Notes",
    tabDiscussion: "DSE Oral Simulator",
    tabKnowledge: "Knowledge Base",
    tabInvestor: "Subscription & Investor",
    langSelect: "Language",

    // Interactive Landing
    landingSectionTitle: "EduBridge HK Core Platform Showcase (Click to Collapse / Expand)",
    collapse: "Collapse",
    expand: "Expand",
    landingBadge: "EduBridge HK • AI Learning Platform for HK New Immigrant Students",
    landingMainTitle: "Master EMI School Adaptation",
    landingMainSubtitle: "AI Companion for HKDSE & Secondary School EMI Success",
    landingDesc: "Snap any English textbook or school notice for direct OCR text extraction, 0.8x slow British speech narration, 4-candidate AI group oral mock, and smart DSE vocabulary flashcards!",
    snapLearnBtn: "📸 Try Snap & Learn (即影即學)",
    generateDseBtn: "✨ AI DSE Passage Generator",
    videoDemoTitle: "Core Features Video Showcase",
    tapToWatch: "Click card to watch feature video",

    // Card 1
    card1Badge: "🏆 WINNING FEATURE",
    card1Title: "1. Snap & Learn (即影即學)",
    card1Sub: "Direct Photo OCR & Text Extraction",
    card1Desc: "Snap textbook pages, worksheets, or school notices. AI directly extracts text and highlights DSE Level 5* vocabulary and grammar!",

    // Card 2
    card2Badge: "🎧 0.8x SLOW SPEECH",
    card2Title: "2. 0.8x British Slow Speech",
    card2Sub: "Conquer EMI School Listening Anxiety",
    card2Desc: "Authentic British & US pronunciation with 0.8x slow speed mode and linking sound guides to help students master all-English classrooms!",

    // Card 3
    card3Badge: "🗣️ PAPER 4 ORAL",
    card3Title: "3. DSE 4-Candidate AI Oral Mock",
    card3Sub: "Paper 4 Group Discussion Simulator",
    card3Desc: "Practice with Candidate A, B, and C agents in real-time. Receive automated 5** exam rubric evaluation reports from AI examiners!",

    // Card 4
    card4Badge: "🧠 SMART FLASHCARDS",
    card4Title: "4. Personal Knowledge Base",
    card4Sub: "Auto Archive & Spaced Repetition",
    card4Desc: "All captured passages, high-frequency DSE vocabularies, and mistakes are archived automatically into mobile flashcards for smart review!",

    listenNarration: "Listen 0.8x Narration",
    stopNarration: "Stop Narration",

    // Snap & Learn
    snapTitle: "Snap & Learn / Voice Notes Assistant",
    snapSubtitle: "Snap textbooks, HK school notices or enter text for instant AI speech reading & DSE breakdown",
    modePreset: "Demo Presets",
    modeText: "Paste Text",
    modeUpload: "Upload Image",
    selectPresetLabel: "⚡ Try HK Secondary School Preset Samples:",
    singlePresetNotice: "Featured Preset Sample",
    passageLoaded: "Passage Loaded",
    snapLearnFeature: "🏆 Snap & Learn (Winning Feature)",
    fullScreenFocusMode: "Full-Screen Snap & Learn Focus Mode",
    openFullScreenSnap: "📸 Open Full-Screen Snap & Learn (Mobile Focus)",
    exitFullScreen: "✕ Exit Full Screen",
    mobileScanHint: "Snap or upload textbook page anytime for instant 0.8x Karaoke audio & DSE vocab analysis!",
    aiGenerateNewArticle: "✨ AI Generate New Short Article",
    generatingArticle: "AI is creating a brand new DSE article & vocabulary...",
    pasteTextPlaceholder: "Paste any English textbook text, DSE practice question, or school notice here...",
    startAnalysis: "Start AI Voice & DSE Breakdown",
    analyzing: "Gemini AI is analyzing vocabulary & pronunciation...",
    uploadTitle: "Click or drag textbook photos / assignment screenshots",
    uploadSubtitle: "Supports JPG, PNG formats",
    reselectPhoto: "Click to re-select photo",
    startOcr: "Start OCR Photo Analysis",
    ocrAnalyzing: "AI is processing OCR and multimodal analysis...",
    directOcrTitle: "Direct OCR Text Box (Extracted English text auto-loaded to Audio Engine)",
    startOcrAnalysis: "Run English DSE OCR & Analysis",
    focusCameraShot: "📸 Camera Snap",
    focusUploadFile: "🖼️ Upload Photo File",
    focusPastePassage: "📝 Paste Passage",
    focusCollapsePaste: "Collapse Paste Box ▲",
    focusPasteTitle: "Paste or enter English study passage (Paste / Edit)",
    focusPastePlaceholder: "Paste English textbook passage, DSE questions, or school notice text here...",
    focusStartAiAnalysis: "🚀 Start AI Analysis & Speech",
    focusEditPassage: "✏️ Edit / Paste Text",
    focusDoneEditing: "Done Editing",
    focusActiveTextHeader: "Passage Text (Active Text)",
    focusSyncNotice: "✓ Content synced in real time for 0.8x slow reading or speech diagnosis",
    focusSaveLock: "Save & Lock Text",
    focusFabLabel: "Snap & Learn Mode",
    focusEditTextPlaceholder: "Directly edit, paste, or modify passage text here...",
    closeLabel: "✕ Close",
    investorSnapPitchTitle: "Investor Pitch Highlight (Phase 1: Snap & Learn & Voice Engine)",
    investorSnapPitchDesc: "Solves the core pain point for new immigrant students facing English/Cantonese learning hurdles. By snapping a photo or pasting text, the AI instantly performs multimodal OCR, generates native English audio narration, breaks down HKDSE Level 3-5** vocabulary, and auto-saves to their personal Knowledge Base.",

    // Speech Player
    speechEngineTitle: "Native Speech Audio Engine (TTS)",
    speechEngineSub: "Slow speed and pronunciation mode for HK EMI school adaptation",
    speechSpeedLabel: "Speed:",
    slowSpeed: "0.8x Slow",
    playSpeech: "Play Native Audio Now",
    stopSpeech: "Stop Audio Playback",
    speechScriptEditable: "✏️ Speech Script (Editable / Paste any English text here)",
    playAudioTip: "💡 Click 'Play Audio' to listen in 0.8x native British/US accent with real-time Karaoke Red Highlight!",
    karaokeTitle: "🎤 Karaoke Real-Time Red Highlight Speech Mode",
    karaokeReadingHint: "🔥 Reading at 0.8x slow speed with real-time red word highlighting!",
    readPronunciation: "Audio",
    accentUs: "American English (US)",
    accentUk: "British English (UK)",
    accentCantonese: "Cantonese (HK)",
    accentMandarin: "Mandarin (CN)",

    // Shadowing & Pronunciation AI Coach
    shadowCoachTitle: "🎙️ AI Shadowing & Pronunciation Diagnostic Coach",
    shadowCoachSub: "Designed for HKDSE Paper 4 Speaking & New Immigrant students, with live recording & AI score feedback",
    demoTag: " [Interactive Demo / Prototype]",
    demoNotice: "⚠️ Notice: This feature is currently in Interactive Prototype Demo Mode. Real microphone recording & playback is functional! Score breakdown shows the planned DSE oral evaluation logic powered by Gemini Audio API in future release.",
    startRecording: "🎙️ Start Shadowing Recording",
    recordingInProgress: "🔴 Recording in progress... Please follow-read the text above",
    stopRecording: "⏹️ Finish & Get AI Pronunciation Score",
    evaluatingAudio: "⚡ Gemini AI is assessing phonetics, stress, and fluency...",
    overallScore: "DSE Speaking Score",
    accuracyScore: "Phonetic Accuracy",
    fluencyScore: "Fluency & Tempo",
    intonationScore: "DSE Intonation & Stress",
    playMyRecording: "🎧 Play My Recording",
    aiFeedbackTitle: "💡 AI Tutor Diagnostic & Phonetic Corrective Tips:",
    investorShadowingNote: "🏆 EduBridge HK Proprietary Multi-Agent Speech Evaluation Engine (Empowering new immigrant students for HKDSE Oral Exam)",

    // Vocabulary Section
    vocabTitle: "High-Frequency DSE Exam Vocabulary (Level 3 - Level 5**)",
    vocabCount: "High-Level Words",
    generateMoreVocab: "✨ AI Generate More DSE Vocabularies",
    generatingVocab: "AI is analyzing and generating more DSE vocab...",
    dseExample: "DSE Essay Example:",
    saveToKb: "Save to Knowledge Base",
    savedToKb: "Saved to Knowledge Base",

    // AI Tutor
    aiTutorTitle: "AI Voice & Text Tutor",
    aiTutorSub: "Ask any question about grammar, pronunciation, or DSE writing techniques",
    tutorWelcome: "Hello! I have loaded this passage. Ask me anything about DSE grammar, pronunciation, or practice speaking with me!",
    readAloudAnswer: "🔊 Listen to Answer",
    thinkingReply: "AI Tutor is formulating the answer...",
    commonPrompts: "Common DSE Exam Prompts:",
    chatPlaceholder: "Type your question or ask by voice...",

    // Knowledge Base
    kbTitle: "Personal Knowledge Base & History",
    kbSub: "Archive of all scanned passages, DSE vocabularies, and practice logs",
    searchPlaceholder: "Search tags, keywords, or titles...",
    allTags: "All Tags",
    flashcardTitle: "Smart Vocab Flashcard (DSE Flashcards)",
    showFront: "Click to flip to Word",
    showBack: "Click to view Chinese definition & DSE example",
    prevWord: "← Previous Word",
    nextWord: "Next Word →",
    readArticleAudio: "Read Passage",
    deleteAll: "Clear All Records",
    deleteConfirm: "Are you sure you want to clear all history records?",
    deleteSingle: "Delete Record",
    deleteSingleConfirm: "Are you sure you want to delete this record?",
    emptyHistory: "No history records available",

    // Investor / Subscription
    investorTitle: "EduBridge HK: Multi-Agent AI Platform for New Immigrant HKDSE Success",
    investorSub: "Serving 45,000+ new immigrant secondary students in Hong Kong each year.",
    bookDemo: "Book School / Investor Demo Pitch",
    monthly: "Monthly Subscription",
    annual: "Annual Subscription",
    save20: "Save 20%",
  }
};

const TRAD_CHARS = "個換經語國華學數點辦讓離難變應實費質產現術務對邊開關類選體顯設規導創專業劃圖構環處減適復獨權總計節簡續備統視線網購貿運達進遠違遷遲鏈鎖鐘鐵鋼錄鏡頁頂順預領頻題風飛餘鳴樂聲雜慮據擇擔提擁擴擺攜攝齊齒龍龜彙詞義誌誤說請讀課試誠認調談證議讚負貪貫責貯貴貶買貸貼貽賀賄賃貲資賈賊賑賒賓賜賞賠賢賣賤賦賬賭贖贍遺保育東廣莊慶盧斷為臨團園圍塊堅壇報壞壯殼夾奧嬌婦媽孫寶寵審憲宮寧寫寬尋壽將尷尬展屬屠屢歲峽崗嶺鞏幣帥師帳帶幹廠棄弊彈強歸當徹態憑憤懶戰戲戶掃揚拋搜擾攀斬於旋既曇曠書會殺條槓極樞標棧梁樓欄樹橢橋築機檢歐畢斃氣氫氧氨氮氯澤潔濃潤漲溝溫灣濕饋滿滯漸漁滬滲滷演漢漣潛潭潮潰澗澇撫撲撻撼擠擬擷摒擺擼攜攝攢攣攤攪攬攻敘救敗教敞散敬敲整敵敷斂齋斐斑斕斟斡斥斧施旁旅族旗旨旬旭昆昊昌明昏易昔昕暘朗望朝札朱朴朵朽槓概欄築歡輿輦輛輪輯輸輻輾轂轄轅轉軾軟輕載較轍輔輩輝輞輟錕銷銹銼鋨鋒銳銲鋰鋞鋯鋝鋟鋣鋤鋪鋮鋶鋷鋸鋼錈錄錐錒錘錙錚錛錞錟錠錢錦錨錫錮錯錳錶鍊鍋鍍鍛鍀鍁鍃鍆鍇鍈頭雙雜難雲電霧霽靂靈靚靜面革靴靶韁韞韋韌韓韙韜音韶韻頁頂頃項順須頑顧頓頗領頷頻顆題額顎顏顛類願顫顯顱風颯颶飄飆飛食饗飽飾餃餅餉養餌餐餒餓館饋餿饃餾饅饌首香馬馭馮馱馳馴駁駐駕駝駟駛駙駒駢驃驪騁驗駿騎騏騙騰騷騾驅驊驍驕驛驟驢驥體髖高髮鬚鬆鬍鬥鬧暢鬱鬼魅魘魚魷魯鮑鮭鮮鯊鯉鯨鯽鱷鰍鰓鰾鱈鱉鰻鱗鱘鱸鳥鳩鳳鳴鳶鴉鴦鴨鴻鵑鵝鵠鵡鵲鵬鶯鶴鷗鷲鷹鷺鸚鸛鹵鹹鹽鹿麗麥麼黃點黨黴齊齒齡齦齲龍龐龔龜動評核級標准單彙複習劃錯題庫冊";
const SIMP_CHARS = "个换经语国华学数点办让离难变应实费质产现术务对边开关类选体显设规导创专业划图构环处减适复独权总计节简续备统视线网购贸运达进远违迁迟链锁钟铁钢录镜页顶顺预领频题风飞余鸣乐声杂虑据择担提拥扩摆携摄齐齿龙龟汇词义志误说请读课试诚认调谈证议赞负贪贯责贮贵贬买贷贴贻贺贿赁资资贾贼赈赊宾赐赏赔贤卖贱赋账赌赎赡遗保育东广庄庆卢断为临团园围块坚坛报坏壮壳夹奥娇妇妈孙宝宠审宪宫宁写宽寻寿将尴尬展属屠屡岁峡岗岭巩币帅师帐带干厂弃弊弹强归当彻态凭愤懒战戏户扫扬抛搜扰攀斩于旋既昙旷书会杀条杠极枢标栈梁楼栏树椭桥筑机检欧毕毙气氢氧氨氮氯泽洁浓润涨沟温湾湿馈满滞渐渔沪渗卤演汉涟潜潭潮溃涧涝抚扑挞撼挤拟撷摒摆撸携摄攒孪摊搅揽攻叙救败教敞散敬敲整敌敷敛斋斐斑斓斟斡斥斧施旁旅族旗旨旬旭昆昊昌明昏易昔昕旸朗望朝札朱朴朵朽杠概栏筑欢舆辇辆轮辑输辐辗毂辖辕转轼软轻载较辙辅辈辉辋辍锟销锈锉锇锋锐焊锂镝锆锊锓耶锄铺铖锍锎锯钢锈录锥锕锤锱铮锛錞郯锭钱锦锚锡锢错锰表链锅镀锻锝锨锪钔锴锳头双杂难云电雾霁力灵靓静面革靴靶缰韫韦韧韩韪韬音韶韵页顶顷项顺须顽顾顿颇领颔频颗题额额颜颠类愿颤显颅风飒飓飘飙飞食飨饱饰饺饼饷养饵餐馁饿馆馈馊馍馏馒馔首香马驭冯驮驰驯驳驻驾驼驷驶驸驹骈骠骊骋验骏骑骐骗腾骚骡驱骅骁骄驿骤驴骥体髋高发须松胡斗闹畅郁鬼魅魇鱼鱿鲁鲍鲑鲜鲨鲤鲸鲫鳄鳅鳃鳔鳕鳖鳗鳞鲟鲈鸟鸠凤鸣鸢鸦鸯鸭鸿鹃鹅鹄鹉鹊鹏莺鹤鸥鹫鹰鹭鹦鹳卤咸盐鹿丽麦么黄点党霉齐齿龄龈龋龙庞龚龟动评核级标准单汇复习划错题库冊";

const TRAD_TO_SIMP_MAP: Record<string, string> = {};
for (let i = 0; i < TRAD_CHARS.length; i++) {
  TRAD_TO_SIMP_MAP[TRAD_CHARS[i]] = SIMP_CHARS[i] || TRAD_CHARS[i];
}

export function toSimplifiedChinese(str: string): string {
  if (!str) return str;
  return str.split('').map(c => TRAD_TO_SIMP_MAP[c] || c).join('');
}

export function getVocabMeaning(vocab: { meanZh: string; meanCn?: string }, lang?: Language | string): string {
  if (lang === "zh-CN") {
    if (vocab.meanCn && vocab.meanCn.trim().length > 0) {
      return vocab.meanCn;
    }
    return toSimplifiedChinese(vocab.meanZh);
  }
  return vocab.meanZh;
}

