import { useState } from "react";
console.log("FAQSection ACTUAL FILE LOADED");

const faqData = [
  {
    question: "What makes College Companion different from other study apps?",
    answer: "College Companion doesn’t just store your notes — it analyzes your academic patterns. Our AI predicts attendance risks, generates exam-focused questions, extracts key concepts from your syllabus, and builds personalized study roadmaps. It’s like having an academic assistant, not just a planner."
  },
  {
    question: "How accurate is the AI Attendance Prediction?",
    answer: "Our predictive model analyzes your attendance history, subject load, and academic calendar to estimate risk thresholds. While it doesn’t replace official records, students consistently report highly accurate projections that help them avoid falling below required percentages."
  },
  {
    question: "Is my academic data safe?",
    answer: "Yes. Your data is encrypted and securely stored. We do not sell or share student information. College Companion is built with privacy-first architecture to ensure your academic records stay confidential."
  },
  {
    question: "What can I do with the AI Question Generator?",
    answer: "You can generate mock tests, important probable questions, last-minute revision questions, and topic-focused quizzes based on your uploaded syllabus. It adapts difficulty levels based on your needs."
  },{
    question: "Do I need technical knowledge to use this platform?",
    answer: "Not at all. College Companion is built for students. The interface is intuitive, and AI features work automatically once you upload your syllabus or enter attendance data. We provide guides and support to help you get the most out of the platform."
  },{
    question: "Is this platform suitable for competitive exam preparation?",
    answer: "While primarily designed for academic success within college, the AI Question Generator and structured study roadmaps are highly useful for internal exams and subject mastery"
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {faqData.map((item, index) => (
        <div
          key={index}
          className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 cursor-pointer hover:border-blue-500/40 transition-all"
          onClick={() => toggle(index)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{item.question}</h2>
            <span className="text-xl">
              {openIndex === index ? "-" : "+"}
            </span>
          </div>

          {openIndex === index && (
            <p className="mt-4 text-white/60 leading-relaxed">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQSection;