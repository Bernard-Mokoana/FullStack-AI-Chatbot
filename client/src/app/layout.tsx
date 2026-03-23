import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "Authenticated chat experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
