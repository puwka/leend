"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Warehouse, Wrench, Factory } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Строительные объекты",
    description:
      "Разнорабочие, подсобники, бетонщики, каменщики — любые строительные специальности для объектов любого масштаба",
    features: ["Жилые комплексы", "Коммерческая недвижимость", "Инфраструктура"],
  },
  {
    icon: Warehouse,
    title: "Складские работы",
    description:
      "Грузчики, комплектовщики, упаковщики — слаженная работа на складах любой сложности",
    features: ["Погрузка/разгрузка", "Комплектация заказов", "Инвентаризация"],
  },
  {
    icon: Wrench,
    title: "Монтажные работы",
    description:
      "Монтажники металлоконструкций, сборщики, слесари — точная и безопасная работа на высоте и на земле",
    features: ["Металлоконструкции", "Оборудование", "Инженерные системы"],
  },
  {
    icon: Factory,
    title: "Промышленные работы",
    description:
      "Операторы станков, наладчики, разнорабочие на производство — бесперебойная работа вашего предприятия",
    features: ["Производственные линии", "Техобслуживание", "Подсобные работы"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[oklch(0.75_0.18_50)/5] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Наши услуги
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
          >
            Подберём специалистов
            <br />
            <span className="gradient-text">под любую задачу</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Мы точно понимаем, какие специалисты нужны под каждую задачу,
            и предоставляем именно их
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative h-full p-8 md:p-10 rounded-3xl bg-card border border-border hover:border-[oklch(0.75_0.18_50)/30] transition-all duration-500 overflow-hidden">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.75_0.18_50)/5] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <span className="absolute top-6 right-6 font-[var(--font-oswald)] text-7xl md:text-8xl font-bold text-white/[0.03] group-hover:text-[oklch(0.75_0.18_50)/10] transition-colors duration-500">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[oklch(0.75_0.18_50)/10] text-[oklch(0.75_0.18_50)] mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="font-[var(--font-oswald)] text-xl md:text-2xl font-bold uppercase mb-4 group-hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

