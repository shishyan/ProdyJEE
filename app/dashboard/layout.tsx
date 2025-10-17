import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Dashboard - ProdyJEE',
  description: 'Study planning dashboard for JEE preparation',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}