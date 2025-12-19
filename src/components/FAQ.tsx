"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Как быстро вы можете предоставить персонал?",
    answer:
      "В стандартных случаях мы можем вывести персонал на объект в течение 24-48 часов. При срочной необходимости — в тот же день, благодаря резерву из более чем 1000 сотрудников.",
  },
  {
    question: "Какие документы нужны для начала работы?",
    answer:
      "Для начала сотрудничества достаточно заявки с описанием требований к персоналу. Мы заключаем договор на оказание услуг, который включает все необходимые юридические аспекты, страхование и ответственность сторон.",
  },
  {
    question: "Как происходит контроль качества работы?",
    answer:
      "Мы назначаем ответственного менеджера на каждый проект. Он контролирует выход персонала, соблюдение техники безопасности и качество выполнения работ. Вы также получаете ежедневные отчёты по желанию.",
  },
  {
    question: "Что если сотрудник не вышел на смену?",
    answer:
      "В таких случаях мы оперативно производим замену из резерва. Это происходит автоматически и бесплатно. Наша цель — обеспечить бесперебойную работу вашего объекта.",
  },
  {
    question: "Какие гарантии вы предоставляете?",
    answer:
      "Мы гарантируем качество подбора персонала, соблюдение сроков и техники безопасности. Все сотрудники застрахованы. В случае претензий к качеству работы — производим замену или возвращаем оплату.",
  },
  {
    question: "Как формируется стоимость услуг?",
    answer:
      "Стоимость зависит от квалификации специалистов, объёма работ, сроков и специфики проекта. Мы предоставляем прозрачную калькуляцию и не имеем скрытых платежей. Свяжитесь с нами для расчёта стоимости под ваш проект.",
  },
  {
    question: "Работаете ли вы с юридическими лицами?",
    answer:
      "Да, мы работаем как с юридическими лицами, так и с индивидуальными предпринимателями. Предоставляем полный пакет закрывающих документов: акты, счета-фактуры и т.д.",
  },
  {
    question: "В каких регионах вы работаете?",
    answer:
      "Основной регион работы — Москва и Московская область. Для крупных проектов готовы рассмотреть работу в других регионах России.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 relative overflow-hidden bg-card/50">
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Вопросы и ответы
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
            >
              Частые <span className="gradient-text">вопросы</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg mb-8"
            >
              Ответы на популярные вопросы о нашей работе. Не нашли ответ?
              Свяжитесь с нами!
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              href="#contacts"
              className="inline-flex items-center gap-2 text-[oklch(0.75_0.18_50)] hover:text-[oklch(0.85_0.18_50)] font-medium transition-colors"
            >
              Задать вопрос
              <span>→</span>
            </motion.a>
          </div>

          {/* Right Column - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-background/50 border border-border rounded-2xl px-6 data-[state=open]:border-[oklch(0.75_0.18_50)/30] transition-colors duration-300"
                >
                  <AccordionTrigger className="text-left font-medium hover:text-[oklch(0.75_0.18_50)] transition-colors py-5 [&[data-state=open]]:text-[oklch(0.75_0.18_50)]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

