"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function TestCard() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Card CSS Variable Test</h1>
      
      {/* Test 1: Using Card component */}
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Card Component Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This should use the --card and --card-foreground CSS variables.</p>
          <p>Current behavior: Uses bg-card and text-card-foreground classes.</p>
        </CardContent>
      </Card>

      {/* Test 2: Direct CSS variable usage */}
      <div 
        className="max-w-md p-6 border rounded-xl shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)"
        }}
      >
        <h3 className="font-semibold mb-2">Direct CSS Variable Test</h3>
        <p>This uses CSS variables directly in style attribute.</p>
        <p>This should reflect changes to --card immediately.</p>
      </div>

      {/* Test 3: Using Tailwind bg-card class */}
      <div className="max-w-md p-6 border rounded-xl shadow-sm bg-card text-card-foreground">
        <h3 className="font-semibold mb-2">Tailwind bg-card Test</h3>
        <p>This uses Tailwind's bg-card and text-card-foreground classes.</p>
        <p>Should work after proper Tailwind configuration.</p>
      </div>

      {/* Test 4: CSS Variable Display */}
      <div className="max-w-md p-6 border rounded-xl shadow-sm bg-background">
        <h3 className="font-semibold mb-4">CSS Variable Values</h3>
        <div className="space-y-2 text-sm font-mono">
          <div>--card: <span style={{color: "var(--card)"}}>■</span> <span id="card-value"></span></div>
          <div>--card-foreground: <span style={{color: "var(--card-foreground)"}}>■</span> <span id="card-fg-value"></span></div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Display current CSS variable values
          const cardValue = getComputedStyle(document.documentElement).getPropertyValue('--card').trim();
          const cardFgValue = getComputedStyle(document.documentElement).getPropertyValue('--card-foreground').trim();
          
          setTimeout(() => {
            const cardEl = document.getElementById('card-value');
            const cardFgEl = document.getElementById('card-fg-value');
            if (cardEl) cardEl.textContent = cardValue;
            if (cardFgEl) cardFgEl.textContent = cardFgValue;
          }, 100);
        `
      }} />
    </div>
  )
}
