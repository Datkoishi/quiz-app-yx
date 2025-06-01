"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PasswordDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  subjectName: string
}

export function PasswordDialog({ isOpen, onClose, onSuccess, subjectName }: PasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check password
    if (password === "TPM15") {
      // Store password in sessionStorage for this session
      sessionStorage.setItem("adp-access", "granted")
      toast({
        title: "Truy cập thành công!",
        description: "Bạn đã được cấp quyền truy cập môn học này.",
      })
      onSuccess()
      handleClose()
    } else {
      toast({
        title: "Mật khẩu không đúng",
        description: "Vui lòng kiểm tra lại mật khẩu và thử lại.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
    setPassword("")
  }

  const handleClose = () => {
    setPassword("")
    setShowPassword(false)
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Môn học được bảo vệ
          </DialogTitle>
          <DialogDescription>
            Môn học "{subjectName}" yêu cầu mật khẩu để truy cập. Vui lòng nhập mật khẩu để tiếp tục.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || !password.trim()}>
              {isLoading ? "Đang kiểm tra..." : "Truy cập"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
