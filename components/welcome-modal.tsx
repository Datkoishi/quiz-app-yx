"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const imageProtectionStyles = `
  .protected-image {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    pointer-events: none;
  }
  
  .protected-image::selection {
    background: transparent;
  }
  
  .protected-image::-moz-selection {
    background: transparent;
  }
`

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    {
      character: "girl",
      text: "Chúc các bạn thi tốt trong kì thi kết thúc học phần! 🌸",
      subtext: "Hãy ôn thi thật vui vẻ và tự tin bước vào phòng thi nhé! Các bạn sẽ làm được thôi! 💪",
    },
    {
      character: "boy",
      text: "Chúc các bạn ôn thi thật hiệu quả và vui vẻ! 📚",
      subtext: "Đừng quá căng thẳng, hãy học một cách thoải mái và tận hưởng quá trình học tập! 😊",
    },
    {
      character: "girl",
      text: "Chúc các bạn đạt kết quả cao trong kì thi sắp tới! ✨",
      subtext: "Ôn thi không chỉ là ghi nhớ mà còn là hiểu sâu kiến thức. Chúc các bạn học vui! 🎯",
    },
    {
      character: "boy",
      text: "Chúc các bạn tự tin và bình tĩnh trong mọi bài thi! 🚀",
      subtext: "Hãy biến việc ôn thi thành một trải nghiệm thú vị. Kiến thức sẽ đến một cách tự nhiên! 🌟",
    },
  ]

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [isOpen, messages.length])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative max-w-4xl mx-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <style dangerouslySetInnerHTML={{ __html: imageProtectionStyles }} />
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-300/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-300/20 rounded-full blur-xl animate-pulse delay-500"></div>
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Header */}
            <div className="relative z-10 text-center pt-8 pb-4">
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Trường Đào tạo Quốc tế - Đại học Duy Tân
                </span>
              </motion.div>

              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2 mt-2"
              >
                Chào mừng đến với hệ thống ôn thi! 🎉
              </motion.h1>
            </div>

            {/* Main content */}
            <div className="relative z-10 px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Characters */}
                <div className="relative">
                  <motion.div
                    key={currentMessage}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center items-end gap-4"
                  >
                    {/* Girl character */}
                    <motion.div
                      animate={{
                        scale: messages[currentMessage].character === "girl" ? 1.1 : 0.9,
                        y: messages[currentMessage].character === "girl" ? -10 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="relative select-none"
                    >
                      <div className="relative">
                        <Image
                          src="/images/dtu-student-girl.png"
                          alt="DTU Student Girl"
                          width={180}
                          height={240}
                          className="drop-shadow-lg select-none pointer-events-none"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          style={{
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            msUserSelect: "none",
                          }}
                        />
                        {/* Watermark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent pointer-events-none select-none">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white/20 text-xs font-bold transform -rotate-45 select-none pointer-events-none">
                              DTU QUIZ SYSTEM
                            </div>
                          </div>
                        </div>
                        {/* Protection overlay */}
                        <div className="absolute inset-0 bg-transparent pointer-events-none select-none" />
                        {messages[currentMessage].character === "girl" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 pointer-events-none"
                          >
                            <Sparkles className="h-6 w-6 text-pink-500 animate-pulse" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Boy character */}
                    <motion.div
                      animate={{
                        scale: messages[currentMessage].character === "boy" ? 1.1 : 0.9,
                        y: messages[currentMessage].character === "boy" ? -10 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="relative select-none"
                    >
                      <div className="relative">
                        <Image
                          src="/images/dtu-student-boy.png"
                          alt="DTU Student Boy"
                          width={180}
                          height={240}
                          className="drop-shadow-lg select-none pointer-events-none"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          style={{
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            msUserSelect: "none",
                          }}
                        />
                        {/* Watermark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent pointer-events-none select-none">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white/20 text-xs font-bold transform rotate-45 select-none pointer-events-none">
                              DTU QUIZ SYSTEM
                            </div>
                          </div>
                        </div>
                        {/* Protection overlay */}
                        <div className="absolute inset-0 bg-transparent pointer-events-none select-none" />
                        {messages[currentMessage].character === "boy" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 pointer-events-none"
                          >
                            <Star className="h-6 w-6 text-blue-500 animate-pulse" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Message bubble */}
                <div className="relative">
                  <motion.div
                    key={currentMessage}
                    initial={{ x: 50, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                  >
                    {/* Speech bubble tail */}
                    <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-white/90 dark:bg-gray-800/90 rotate-45 border-l border-b border-white/20"></div>
                    </div>

                    <div className="space-y-4">
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed"
                      >
                        {messages[currentMessage].text}
                      </motion.p>

                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 dark:text-gray-400 leading-relaxed"
                      >
                        {messages[currentMessage].subtext}
                      </motion.p>

                      {/* Progress dots */}
                      <div className="flex justify-center gap-2 pt-2">
                        {messages.map((_, index) => (
                          <motion.div
                            key={index}
                            animate={{
                              scale: index === currentMessage ? 1.2 : 1,
                              backgroundColor: index === currentMessage ? "#8b5cf6" : "#d1d5db",
                            }}
                            className="w-2 h-2 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Action buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center gap-4 mt-8"
              >
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  Bắt đầu học ngay! 🚀
                </Button>
              </motion.div>

              {/* Footer message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-6"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  💡 Ôn thi hiệu quả = Học đều đặn + Nghỉ ngơi đủ + Tâm lý thoải mái!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
