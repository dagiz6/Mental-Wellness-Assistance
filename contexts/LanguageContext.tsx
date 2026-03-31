"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "am";

export const translations = {
  en: {
    nav: {
      home: "Home",
      journal: "Journal",
      chat: "AI Chat",
      healthAdvice: "Health Advice",
      mentalPeace: "Mental Peace",
      about: "About",
      signIn: "Sign In",
      getStarted: "Get Started",
      logout: "Sign Out",
      settings: "Settings",
      preferences: "Preferences",
      theme: "Theme",
      navigation: "Navigation",
      mindMate: "MindMate"
    },
    settings: {
      title: "Settings",
      description: "Manage your account settings and preferences.",
      language: "Language",
      languageDesc: "Choose your preferred language for the interface.",
      english: "English",
      amharic: "Amharic (አማርኛ)",
      theme: "Theme",
      themeDesc: "Select light, dark, or system preference.",
      account: "Account Information",
      accountDesc: "View your active session details.",
      name: "Name",
      email: "Email"
    },
    home: {
      welcome: "Welcome to MindMate",
      subtitle: "Your sanctuary for mental clarity and emotional well-being",
      recentActivity: "Recent Activity",
      noActivity: "No recent activity yet. Start your wellness journey today!"
    },
    dailyInsight: {
      title: "Daily Insight",
      insight: "Taking a few minutes for mindful breathing can reset your nervous system and improve your focus throughout the day.",
      todayTip: "Today's Tip",
      refresh: "Refresh"
    },
    quickAccess: {
      title: "Quick Access",
      journalTitle: "Journal",
      journalDesc: "Reflect and get AI insights",
      chatTitle: "AI Chat",
      chatDesc: "Talk to your wellness AI",
      peaceTitle: "Mental Peace",
      peaceDesc: "Inner calm techniques"
    },
    about: {
      title: "About MindMate",
      intro: "MindMate — is your personal sanctuary for mental clarity and emotional well-being. Inspired by ancient concepts of balance and modern intelligence, MindMate blends the wisdom of mindful living with the power of advanced AI.",
      missionTitle: "Our Mission",
      mission1: "Our mission is simple: To provide a private, intelligent, and comforting space for daily self-care, reflection, and emotional support — without judgment, tracking, or cloud storage.",
      mission2: "Whether you're journaling your thoughts, checking in on your mood, or seeking health and wellness tips, MindMate is designed to meet you with calm, insight, and compassion — every single day.",
      privacyTitle: "Privacy First",
      privacyDesc: "All your data stays on your device. Nothing is sent to the cloud.",
      aiTitle: "AI-Powered Insights",
      aiDesc: "Advanced AI helps you understand patterns and provides personalized guidance.",
      tagline: "\"Live gently. Think clearly. Feel deeply.\"",
      worksTitle: "How MindMate Works",
      step1Title: "Journal Your Thoughts",
      step1Desc: "Write down your feelings and experiences. MindMate's AI will analyze the emotions and provide insights.",
      step2Title: "Track Your Mood",
      step2Desc: "Log your daily mood with simple selections. Discover patterns over time.",
      step3Title: "Chat with Your AI",
      step3Desc: "Have supportive conversations with Vihaara's AI assistant for guidance and mental wellness tips.",
      step4Title: "Receive Daily Tips",
      step4Desc: "Get personalized wellness suggestions based on your mood patterns and journal content.",
      commitmentTitle: "Privacy Commitment",
      commitmentDesc: "Your mental wellness journey is deeply personal. We're committed to protecting your privacy and ensuring your data remains yours alone, never shared, and completely secure."
    },
    mentalPeace: {
      title: "Mental Peace",
      description: "Discover techniques for cultivating mental peace and emotional balance. Select a category to receive guidance that can help bring tranquility to your busy life.",
      disclaimer: "For persistent mental health concerns, please consult with a qualified professional.",
      getTechniqueBtn: "Get {technique} Technique",
      loading: "Generating advice...",
      // categories
      tech_mindfulness_title: "Mindfulness",
      tech_mindfulness_desc: "Present-moment awareness practices to calm your mind.",
      tech_mindfulness_technique: "Start with 5-10 minute sessions. Sit comfortably and focus on your breath. When your mind wanders, gently bring attention back to the present moment without judgment. Practice daily for best results.",
      tech_stress_title: "Stress Relief",
      tech_stress_desc: "Techniques to manage and reduce stress levels.",
      tech_stress_technique: "Try progressive muscle relaxation: tense and release each muscle group for 5 seconds. Use the 4-7-8 breathing method: inhale for 4 counts, hold for 7, exhale for 8. Practice these daily.",
      tech_breathing_title: "Breathing",
      tech_breathing_desc: "Breathing exercises for instant calm and relaxation.",
      tech_breathing_technique: "Box breathing: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 5-10 times. Alternate nostril breathing: Close right nostril, inhale left, switch, exhale right.",
      tech_affirmations_title: "Affirmations",
      tech_affirmations_desc: "Positive affirmations to build mental resilience.",
      tech_affirmations_technique: "Choose 2-3 affirmations that resonate with you. Repeat them daily, preferably in the morning and evening. Examples: \"I am capable,\" \"I am worthy,\" \"I choose peace.\"",
      tech_meditation_title: "Meditation",
      tech_meditation_desc: "Guided meditation for emotional balance and clarity.",
      tech_meditation_technique: "Find a quiet space and sit comfortably. Close your eyes and focus on a mantra or breath. Start with 10-15 minutes daily. Guided meditation apps can help you get started."
    },
    healthAdvice: {
      title: "Health Advice",
      description: "Get evidence-based advice for improving your physical health and wellbeing. Select a category below to receive personalized suggestions that align with your needs.",
      disclaimer: "Always consult healthcare professionals for personalized medical advice.",
      getAdviceBtn: "Get {category} Advice",
      loading: "Generating advice...",
      // categories
      cat_general_title: "General Wellness",
      cat_general_desc: "Overall wellness advice for a balanced, healthy lifestyle.",
      cat_general_advice: "Maintain a consistent sleep schedule, stay hydrated, exercise regularly, and eat balanced meals. Aim for 7-9 hours of sleep, drink at least 8 glasses of water daily, and engage in at least 150 minutes of moderate physical activity per week.",
      cat_nutrition_title: "Nutrition",
      cat_nutrition_desc: "Evidence-based nutritional guidance for optimal health.",
      cat_nutrition_advice: "Incorporate a variety of whole foods including fruits, vegetables, lean proteins, and whole grains. Reduce processed foods and added sugars. Consider consulting a nutritionist for personalized meal plans.",
      cat_sleep_title: "Sleep",
      cat_sleep_desc: "Tips for better sleep quality and sleep hygiene.",
      cat_sleep_advice: "Create a dark, quiet, and cool sleep environment. Avoid screens 30 minutes before bed. Maintain a consistent sleep schedule even on weekends. Try relaxation techniques like deep breathing or meditation.",
      cat_hydration_title: "Hydration",
      cat_hydration_desc: "Guidance on proper hydration and fluid intake.",
      cat_hydration_advice: "Drink water throughout the day, not just when thirsty. Aim for 2-3 liters daily, adjusting for activity level and climate. Include hydrating foods like fruits and vegetables.",
      cat_posture_title: "Posture",
      cat_posture_desc: "Exercises and tips for maintaining healthy posture.",
      cat_posture_advice: "Keep your shoulders relaxed, maintain neutral spine alignment, and take frequent breaks when sitting. Practice stretching and strengthening exercises daily to support good posture."
    },
    chatHistory: {
      title: "Chat History",
      description: "View and continue your past conversations with MindMate.",
      noSessions: "No chat history found. Start a new conversation!",
      newChat: "New Chat",
      sessionLabel: "Session from",
      viewChat: "View Chat",
      loading: "Loading history..."
    }
  },
  am: {
    nav: {
      home: "ዋና ገጽ",
      journal: "ማስታወሻ",
      chat: "የአይአይ ውይይት",
      healthAdvice: "የጤና ምክር",
      mentalPeace: "የአእምሮ ሰላም",
      about: "ስለ እኛ",
      signIn: "ግባ",
      getStarted: "ጀምር",
      logout: "ውጣ",
      settings: "ቅንብሮች", 
      preferences: "ምርጫዎች", 
      theme: "ገጽታ", 
      navigation: "የማውጫ ቁልፎች",
      mindMate: "ማይንድሜት"
    },
    settings: {
      title: "ቅንብሮች",
      description: "የመለያዎን ቅንብሮች እና ምርጫዎች ያስተዳድሩ።",
      language: "ቋንቋ",
      languageDesc: "የመረጡትን ቋንቋ ይምረጡ።",
      english: "እንግሊዝኛ (English)",
      amharic: "አማርኛ",
      theme: "ገጽታ",
      themeDesc: "የብርሃን፣ የጨለማ ወይም የስርዓት ምርጫዎን ይምረጡ።",
      account: "የመለያ መረጃ",
      accountDesc: "ገባሪ የመለያ ዝርዝሮችዎን ይመልከቱ።",
      name: "ስም",
      email: "ኢሜይል"
    },
    home: {
      welcome: "እንኳን ወደ ማይንድሜት በደህና መጡ",
      subtitle: "ለአእምሮ ጥራት እና ለስሜት ደህንነት የግል ማረፊያዎ",
      recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",
      noActivity: "ምንም የቅርብ ጊዜ እንቅስቃሴ የለም። የጤንነት ጉዞዎን ዛሬ ይጀምሩ!"
    },
    dailyInsight: {
      title: "ዕለታዊ ግንዛቤ",
      insight: "ለጥቂት ደቂቃዎች በአስተሳሰብ መተንፈስ የነርቭ ስርዓትዎን እንደገና ያስጀምራል እና ቀኑን ሙሉ ትኩረትዎን ያሻሽላል።",
      todayTip: "የዛሬው ምክር",
      refresh: "አድስ"
    },
    quickAccess: {
      title: "ፈጣን መዳረሻ",
      journalTitle: "ማስታወሻ",
      journalDesc: "አንጸባርቁ እና የአይአይ ግንዛቤዎችን ያግኙ",
      chatTitle: "አይአይ ውይይት",
      chatDesc: "ከጤንነት አይአይዎ ጋር ይነጋገሩ",
      peaceTitle: "የአእምሮ ሰላም",
      peaceDesc: "የውስጣዊ መረጋጋት ዘዴዎች"
    },
    about: {
      title: "ስለ ማይንድሜት",
      intro: "ማይንድሜት — ለአእምሮ ጥራት እና ለስሜት ደህንነት የግል ማረፊያዎ ነው። ከጥንታዊ የሚዛን ጽንሰ-ሀሳቦች እና ዘመናዊ የማሰብ ችሎታ በመነሳት፣ ማይንድሜት የንቃት ኑሮ ጥበብን ከላቀ የአይአይ ኃይል ጋር ያዋህዳል።",
      missionTitle: "የእኛ ተልእኮ",
      mission1: "ተልእኳችን ቀላል ነው፡ ያለፍርድ፣ ያለክትትል ወይም ክላውድ ማከማቻ ለዕለታዊ ራስን መንከባከብ፣ ማሰላሰል እና የስሜት ድጋፍ የግል፣ ብልህ እና ምቹ ቦታን መስጠት።",
      mission2: "ሀሳቦችዎን በማስታወሻም ቢጽፉ፣ ስሜትዎን ቢፈትሹ፣ ወይም የጤና እና የደህንነት ምክሮችን ቢፈልጉ፣ ማይንድሜት በየቀኑ በረጋ መንፈስ፣ በማስተዋል እና በሩህሩህነት ሊያገኝዎት ታስቦ የተዘጋጀ ነው።",
      privacyTitle: "ግላዊነት ቅድሚያ ተሰጥቶታል",
      privacyDesc: "ሁሉንም መረጃዎ በመሣሪያዎ ላይ ይቆያል። ወደ ክላውድ የሚላክ ምንም ነገር የለም።",
      aiTitle: "በአይአይ የተደገፉ ግንዛቤዎች",
      aiDesc: "ላቀ አይአይ ንድፎችን እንዲረዱ እና ግላዊነት የተላበሰ መመሪያ እንዲሰጡ ይረዳዎታል።",
      tagline: "\"በቀስታ ይኑሩ። በግልፅ ያስቡ። በጥልቅ ይሰማዎት።\"",
      worksTitle: "ማይንድሜት እንዴት እንደሚሰራ",
      step1Title: "ሀሳቦችዎን ይመዝግቡ",
      step1Desc: "ስሜቶችዎን እና ተሞክሮዎችዎን ይፃፉ። የማይንድሜት አይአይ ስሜቶችን በመተንተን ግንዛቤዎችን ይሰጣል።",
      step2Title: "ስሜትዎን ይከታተሉ",
      step2Desc: "ዕለታዊ ስሜትዎን በቀላል ምርጫዎች ይመዝግቡ። ከጊዜ ሂደት ጋር ንድፎችን ያግኙ።",
      step3Title: "ከአይአይዎ ጋር ይወያዩ",
      step3Desc: "ለመመሪያ እና ለአእምሮ ጤንነት ምክሮች ከማይንድሜት አይአይ ረዳት ጋር የሚያበረታቱ ውይይቶችን ያድርጉ።",
      step4Title: "ዕለታዊ ምክሮችን ይቀበሉ",
      step4Desc: "በስሜትዎ ንድፎች አና ማስታወሻ ይዘትዎ ላይ በመመርኮዝ ግላዊነት የተላበሱ የጤንነት ጥቆማዎችን ያግኙ።",
      commitmentTitle: "የግላዊነት ቃል ኪዳን",
      commitmentDesc: "የአእምሮ ጤንነት ጉዞዎ እጅግ ግላዊ ነው። ግላዊነትዎን ለመጠበቅ እና መረጃዎ የእርስዎ ብቻ እንዲሆን ለማረጋገጥ ቃል እንገባለን—ሁልጊዜ በአካባቢው የሚከማች፣ ፈጽሞ የማይጋራ እና ሙሉ በሙሉ ደህንነቱ የተጠበቀ።"
    },
    mentalPeace: {
      title: "የአእምሮ ሰላም",
      description: "ለአእምሮ ሰላም እና ለስሜት ሚዛን የሚያገለግሉ ዘዴዎችን ያግኙ። በተጨናነቀ ህይወትዎ ውስጥ መረጋጋትን ሊያመጣ የሚችል መመሪያ ለማግኘት አንድ ምድብ ይምረጡ።",
      disclaimer: "ለማያባራ የአእምሮ ጤና ስጋቶች እባክዎን ብቃት ያለው ባለሙያ ያማክሩ።",
      getTechniqueBtn: "የ{technique} ዘዴን ያግኙ",
      loading: "ምክር በማመንጨት ላይ...",
      tech_mindfulness_title: "ንቃት (Mindfulness)",
      tech_mindfulness_desc: "አእምሮዎን ለማረጋጋት አሁን ባለው ጊዜ ላይ የማተኮር ልምዶች።",
      tech_mindfulness_technique: "ከ5-10 ደቂቃ ክፍለ ጊዜዎች ይጀምሩ። በተመቻቸ ሁኔታ ይቀመጡ እና በአተነፋፈስዎ ላይ ያተኩሩ። አእምሮዎ ሲንከራተት፣ ያለፍርድ ትኩረትዎን በቀስታ ወደ አሁኑ ጊዜ ይመልሱ። ለበለጠ ውጤት በየቀኑ ይለማመዱ።",
      tech_stress_title: "የጭንቀት እፎይታ (Stress Relief)",
      tech_stress_desc: "የጭንቀት ደረጃዎችን ለማስተዳደር እና ለመቀነስ ዘዴዎች።",
      tech_stress_technique: "ተራማጅ የጡንቻ ዘና ማለትን ይሞክሩ፡ እያንዳንዱን የጡንቻ ቡድን ለ5 ሰከንዶች ያጥብቁ እና ይልቀቁ። የ4-7-8 የአተነፋፈስ ዘዴን ይጠቀሙ፡ ለ4 ቆጠራዎች ወደ ውስጥ ይተንፍሱ፣ ለ7 ይያዙ፣ ለ8 ወደ ውጭ ይተንፍሱ። እነዚህን በየቀኑ ይለማመዱ።",
      tech_breathing_title: "አተነፋፈስ (Breathing)",
      tech_breathing_desc: "ለፈጣን መረጋጋት እና ዘና ለማለት የአተነፋፈስ እንቅስቃሴዎች።",
      tech_breathing_technique: "ሣጥን አተነፋፈስ፡ ለ4 ቆጠራዎች ወደ ውስጥ ይተንፍሱ፣ ለ4 ይያዙ፣ ለ4 ወደ ውጭ ይተንፍሱ፣ ለ4 ይያዙ። ከ5-10 ጊዜ ይድገሙ። የግራና ቀኝ አፍንጫ መተንፈስ፡ የቀኝ አፍንጫን ይዝጉ፣ በግራ ይተንፍሱ፣ ይቀያይሩ፣ በቀኝ ይተንፍሱ።",
      tech_affirmations_title: "አዎንታዊ ማረጋገጫዎች (Affirmations)",
      tech_affirmations_desc: "የአእምሮ ጥንካሬን ለመገንባት አዎንታዊ ማረጋገጫዎች።",
      tech_affirmations_technique: "ለእርስዎ ትርጉም የሚሰጡ 2-3 ማረጋገጫዎችን ይምረጡ። በየቀኑ፣ በተለይም ጠዋት እና ማታ ይድገሟቸው። ምሳሌዎች: \"እኔ እችላለሁ፣\" \"እኔ ብቁ ነኝ፣\" \"እኔ ሰላምን እመርጣለሁ።\"",
      tech_meditation_title: "ማሰላሰል (Meditation)",
      tech_meditation_desc: "ለስሜት ሚዛን እና ጥራት የሚመራ ማሰላሰል።",
      tech_meditation_technique: "ጸጥ ያለ ቦታ ይፈልጉ እና በተመቻቸ ሁኔታ ይቀመጡ። አይኖችዎን ይዝጉ እና በማንትራ ወይም በአተነፋፈስ ላይ ያተኩሩ። በየቀኑ ከ10-15 ደቂቃዎች ይጀምሩ። የሚመሩ የማሰላሰል መተግበሪያዎች ለመጀመር ሊረዱዎት ይችላሉ።"
    },
    healthAdvice: {
      title: "የጤና ምክር",
      description: "አካላዊ ጤናዎን እና ደህንነትዎን ለማሻሻል በማስረጃ የተደገፈ ምክር ያግኙ። ከፍላጎቶችዎ ጋር የሚጣጣሙ ግለሰባዊ ጥቆማዎችን ለማግኘት ከዚህ በታች ያለውን ምድብ ይምረጡ።",
      disclaimer: "ለግል የህክምና ምክር ሁልጊዜ የጤና ባለሙያዎችን ያማክሩ።",
      getAdviceBtn: "የ{category} ምክር ያግኙ",
      loading: "ምክር በማመንጨት ላይ...",
      cat_general_title: "አጠቃላይ ደህንነት (General Wellness)",
      cat_general_desc: "ለተመጣጠነ፣ ጤናማ የአኗኗር ዘይቤ አጠቃላይ የጤንነት ምክር።",
      cat_general_advice: "ወጥ የሆነ የእንቅልፍ መርሃ ግብር ይጠብቁ፣ በቂ ውሃ ይጠጡ፣ አዘውትረው የአካል ብቃት እንቅስቃሴ ያድርጉ እና የተመጣጠነ ምግብ ይመገቡ። በቀን ከ7-9 ሰዓታት እንቅልፍ ያግኙ፣ በቀን ቢያንስ 8 ብርጭቆ ውሃ ይጠጡ እና በሳምንት ቢያንስ 150 ደቂቃዎች መካከለኛ የአካል ብቃት እንቅስቃሴ ያድርጉ።",
      cat_nutrition_title: "ስነ-ምግብ (Nutrition)",
      cat_nutrition_desc: "ለተሻለ ጤና በማስረጃ የተደገፈ የአመጋገብ መመሪያ።",
      cat_nutrition_advice: "ፍራፍሬዎችን፣ አትክልቶችን፣ ዝቅተኛ ቅባት ያላቸውን ፕሮቲኖችን እና ሙሉ እህሎችን ጨምሮ የተለያዩ ያልተመረቱ ምግቦችን ያካትቱ። የተዘጋጁ አርቴፊሻል ምግቦችን እና የተጨመሩ ስኳሮችን ይቀንሱ። ለግል የምግብ እቅዶች የስነ-ምግብ ባለሙያን ማማከር ያስቡበት።",
      cat_sleep_title: "እንቅልፍ (Sleep)",
      cat_sleep_desc: "ለተሻለ የእንቅልፍ ጥራት እና የእንቅልፍ ንጽህና ምክሮች።",
      cat_sleep_advice: "ጨለማ፣ ጸጥ ያለ እና ቀዝቃዛ የእንቅልፍ አካባቢ ይፍጠሩ። ከመተኛትዎ 30 ደቂቃዎች በፊት ስክሪኖችን (ስልክ ወ.ዘ.ተ) ያስወግዱ። በሳምንቱ መጨረሻ ቀናትም ቢሆን ወጥ የሆነ የእንቅልፍ መርሃ ግብር ይጠብቁ። ጥልቅ መተንፈስ ወይም ማሰላሰል የመሳሰሉ የዘና ማለቻ ዘዴዎችን ይሞክሩ።",
      cat_hydration_title: "እርጥበት (Hydration)",
      cat_hydration_desc: "በትክክለኛ እርጥበት እና ፈሳሽ አወሳሰድ ላይ መመሪያ።",
      cat_hydration_advice: "ሲጠማዎት ብቻ ሳይሆን ቀኑን ሙሉ ውሃ ይጠጡ። በቀን ከ2-3 ሊትር ይጠጡ፣ እንደ እንቅስቃሴ ደረጃ እና የአየር ንብረት ያስተካክሉ። እርጥበት አዘል ምግቦችን እንደ ፍራፍሬዎች እና አትክልቶች ያካትቱ።",
      cat_posture_title: "አቋም (Posture)",
      cat_posture_desc: "ጤናማ አቋምን ለመጠበቅ ልምምዶች እና ምክሮች።",
      cat_posture_advice: "ትከሻዎን ዘና ያድርጉ፣ ገለልተኛ የአከርካሪ አሰላለፍ ይጠብቁ እና ሲቀመጡ ተደጋጋሚ እረፍቶችን ይውሰዱ። ጥሩ አቋምን ለመደገፍ በየቀኑ የመለጠጥ እና የማጠናከሪያ እንቅስቃሴዎችን ይለማመዱ።"
    },
    chatHistory: {
      title: "የውይይት ታሪክ",
      description: "ከማይንድሜት ጋር ያደረጓቸውን የቀድሞ ውይይቶች ይመልከቱ እና ይቀጥሉ።",
      noSessions: "ምንም የውይይት ታሪክ አልተገኘም። አዲስ ውይይት ይጀምሩ!",
      newChat: "አዲስ ውይይት",
      sessionLabel: "የውይይት ቀን",
      viewChat: "ውይይቱን ይመልከቱ",
      loading: "ታሪክ በመጫን ላይ..."
    }
  }
};

type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: keyof Translations, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("app-language") as Language;
    if (saved && (saved === "en" || saved === "am")) {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (section: keyof Translations, key: string): string => {
    const dictionary = translations[language] || translations.en;
    // @ts-ignore
    return dictionary[section]?.[key] || translations.en[section]?.[key] || key;
  };

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a default stub if not wrapped in provider (e.g. server rendered fallback)
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (section: keyof Translations, key: string) => (translations.en[section] as Record<string, string>)?.[key] || key,
    };
  }
  return context;
}
