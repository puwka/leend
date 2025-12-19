import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Тяжёлый Профиль",
  description: "Политика конфиденциальности компании Тяжёлый Профиль. Защита персональных данных пользователей",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

