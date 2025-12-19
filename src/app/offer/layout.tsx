import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Договор публичной оферты — Тяжёлый Профиль",
  description: "Договор публичной оферты компании Тяжёлый Профиль на оказание услуг по аутсорсингу рабочего персонала",
};

export default function OfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

