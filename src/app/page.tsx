"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-30"></div>

      <header className="p-4 flex justify-between items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="text-2xl font-bold text-white flex items-center">
            <img src="/main-logo.png" alt="logo" className="w-40" />
          </Link>
        </motion.div>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-zinc-100 mb-6 relative"
          >
            Find Your Perfect Match
            <Sparkles className="absolute -top-6 -right-6 text-zinc-400 animate-spin-slow" size={32} />
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-xl md:text-2xl text-zinc-400 mb-8"
          >
            <TypeAnimation
              sequence={[
                "Find new friends ",
                2000,
                "Find your date",
                2000,
                "Your date is just a click away",
                2000,
                "Discover new connections",
                2000,
                "Explore your campus",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Number.POSITIVE_INFINITY}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 text-zinc-100 font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 hover:scale-105 border border-zinc-600"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </main>

      <footer className="p-4 text-center text-zinc-500 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="text-sm"
        >
          © 2023 Campus Connection. All rights reserved.
        </motion.p>
      </footer>

      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-zinc-950 to-transparent opacity-50"></div>
    </div>
  )
}

