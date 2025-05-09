import { useState } from "react";
import "./FAQSection.css";

const FAQSection = () => {
  const faqs = [
    {
      question:
        "How can I find the right tutor for my specific learning needs?",
      answer:
        "You can use our search feature to filter tutors based on subject, expertise level, and availability. Each tutor profile includes reviews, ratings, and details about their teaching style, so you can make an informed choice. If you're unsure, you can also request a trial session to see if the tutor is the right fit for you.",
    },
    {
      question:
        "What are the typical costs associated with hiring a tutor, and are there any discounts available?",
      answer:
        "Tutoring rates vary depending on the tutor’s qualifications, subject matter, and experience level. Generally, prices range from $30 to $80 per hour. Some tutors offer discounts for bulk sessions or long-term commitments. Additionally, seasonal promotions and referral discounts may be available.",
    },
    {
      question:
        "What qualifications and background checks do tutors go through before joining the platform?",
      answer:
        "All tutors undergo a strict verification process, which includes credential checks, identity confirmation, and background screening. We ensure that they have relevant experience and expertise in their subject areas. Reviews from previous students also help maintain quality and trust in our tutoring network.",
    },
  ];

  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="faq-section">
      <h2>FAQ</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${
              openIndexes.includes(index) ? "active" : ""
            }`}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question}
              <span>{openIndexes.includes(index) ? "−" : "+"}</span>
            </div>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
