"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Question } from "@/lib/questions"

export default function AdminPage() {
  const { toast } = useToast()
  const [selectedSubject, setSelectedSubject] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState<Omit<Question, "id">>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  const subjects = [
    { id: "xac-suat-thong-ke", name: "Xác Suất Thống Kê" },
    { id: "suc-khoe-moi-truong", name: "Sức Khỏe Môi Trường" },
    { id: "toan-roi-rac", name: "Toán Rời Rạc" },
    { id: "ky-thuat-thuong-mai-dien-tu", name: "Kỹ Thuật Thương Mại Điện Tử" },
    { id: "java-2", name: "Java 2" },
  ]

  // Tải câu hỏi khi chọn môn học
  useEffect(() => {
    if (!selectedSubject) return

    const loadQuestions = async () => {
      try {
        // Trong môi trường thực tế, bạn sẽ fetch dữ liệu từ API
        // const response = await fetch(`/api/questions/${selectedSubject}`);
        // const data = await response.json();
        // setQuestions(data);

        // Hiện tại sử dụng mảng trống
        setQuestions([])
      } catch (error) {
        console.error("Lỗi khi tải câu hỏi:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải câu hỏi. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      }
    }

    loadQuestions()
  }, [selectedSubject, toast])

  // Xử lý thay đổi câu hỏi mới
  const handleNewQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewQuestion((prev) => ({ ...prev, [name]: value }))
  }

  // Xử lý thay đổi đáp án
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options]
    newOptions[index] = value
    setNewQuestion((prev) => ({ ...prev, options: newOptions }))
  }

  // Xử lý thay đổi đáp án đúng
  const handleCorrectAnswerChange = (value: string) => {
    setNewQuestion((prev) => ({ ...prev, correctAnswer: Number.parseInt(value) }))
  }

  // Thêm câu hỏi mới
  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung câu hỏi",
        variant: "destructive",
      })
      return
    }

    // Kiểm tra các đáp án
    if (newQuestion.options.some((option) => !option.trim())) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ các đáp án",
        variant: "destructive",
      })
      return
    }

    const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1
    const questionToAdd: Question = {
      ...newQuestion,
      id: newId,
    }

    setQuestions((prev) => [...prev, questionToAdd])

    // Reset form
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    })

    toast({
      title: "Thành công",
      description: "Đã thêm câu hỏi mới",
    })
  }

  // Xóa câu hỏi
  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
    toast({
      title: "Thành công",
      description: "Đã xóa câu hỏi",
    })
  }

  // Lưu tất cả câu hỏi
  const handleSaveQuestions = async () => {
    if (!selectedSubject) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn môn học",
        variant: "destructive",
      })
      return
    }

    try {
      // Trong môi trường thực tế, bạn sẽ gửi dữ liệu lên API
      // const response = await fetch(`/api/questions/${selectedSubject}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(questions),
      // });

      // if (!response.ok) {
      //   throw new Error("Lỗi khi lưu câu hỏi");
      // }

      toast({
        title: "Thành công",
        description: "Đã lưu tất cả câu hỏi",
      })
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu câu hỏi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Quản Lý Câu Hỏi</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Chọn Môn Học</CardTitle>
              <CardDescription>Chọn môn học để quản lý câu hỏi</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedSubject && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Thêm Câu Hỏi Mới</CardTitle>
                  <CardDescription>Nhập thông tin câu hỏi mới</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question">Nội dung câu hỏi</Label>
                      <Textarea
                        id="question"
                        name="question"
                        placeholder="Nhập nội dung câu hỏi"
                        value={newQuestion.question}
                        onChange={handleNewQuestionChange}
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Các đáp án</Label>
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder={`Đáp án ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                          />
                          <Select
                            value={newQuestion.correctAnswer === index ? "true" : "false"}
                            onValueChange={(value) => {
                              if (value === "true") {
                                handleCorrectAnswerChange(index.toString())
                              }
                            }}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Đáp án đúng?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Đúng</SelectItem>
                              <SelectItem value="false">Sai</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddQuestion}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Thêm Câu Hỏi
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Danh Sách Câu Hỏi</CardTitle>
                    <Button onClick={handleSaveQuestions}>
                      <Save className="mr-2 h-4 w-4" /> Lưu Tất Cả
                    </Button>
                  </div>
                  <CardDescription>
                    {questions.length} câu hỏi cho môn {subjects.find((s) => s.id === selectedSubject)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">Chưa có câu hỏi nào. Hãy thêm câu hỏi mới.</p>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <Card key={question.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">
                                Câu {question.id}: {question.question}
                              </CardTitle>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(question.id)}>
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {question.options.map((option, index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded-md ${
                                    index === question.correctAnswer
                                      ? "bg-green-100 dark:bg-green-900"
                                      : "bg-gray-100 dark:bg-gray-800"
                                  }`}
                                >
                                  {index === question.correctAnswer && (
                                    <span className="font-bold text-green-600 dark:text-green-400">✓ </span>
                                  )}
                                  {option}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
