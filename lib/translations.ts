export const translations = {
  en: {
    appTitle: "CodeTutor AI",
    selectTechnology: "Select Technology",
    selectTopic: "Select a topic to start learning",
    typeMessage: "Ask a follow-up question...",
    send: "Send",
    suggestedQuestions: "Suggested questions:",
    lightMode: "Light",
    darkMode: "Dark",
  },
  ar: {
    appTitle: "مدرس البرمجة الذكي",
    selectTechnology: "اختر التقنية",
    selectTopic: "اختر موضوعًا لبدء التعلم",
    typeMessage: "اطرح سؤالاً للمتابعة...",
    send: "إرسال",
    suggestedQuestions: "أسئلة مقترحة:",
    lightMode: "فاتح",
    darkMode: "داكن",
  },
  fr: {
    appTitle: "CodeTutor IA",
    selectTechnology: "Sélectionner la technologie",
    selectTopic: "Sélectionnez un sujet pour commencer",
    typeMessage: "Posez une question de suivi...",
    send: "Envoyer",
    suggestedQuestions: "Questions suggérées:",
    lightMode: "Clair",
    darkMode: "Sombre",
  },
  es: {
    appTitle: "CodeTutor IA",
    selectTechnology: "Seleccionar tecnología",
    selectTopic: "Selecciona un tema para empezar",
    typeMessage: "Haz una pregunta de seguimiento...",
    send: "Enviar",
    suggestedQuestions: "Preguntas sugeridas:",
    lightMode: "Claro",
    darkMode: "Oscuro",
  },
} as const

export type Language = keyof typeof translations
