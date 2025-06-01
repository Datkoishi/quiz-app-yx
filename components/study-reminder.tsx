"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export function StudyReminder() {
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Show notification every 1 minute (60000ms)
    const interval = setInterval(() => {
      setShowNotification(true)

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-3 max-w-xs"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Đây là tài liệu ôn tập có thể không có trong đề thi
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
