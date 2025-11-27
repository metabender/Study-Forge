import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudyForge — AI Homework Organizer',
  description: 'Turn chaos into a 7-day study plan.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
