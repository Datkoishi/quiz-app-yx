import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Question } from "@/lib/questions"

export async function GET(request: NextRequest, { params }: { params: { subjectId: string } }) {
  try {
    const subjectId = params.subjectId
    const filePath = path.join(process.cwd(), "data", `${subjectId}.json`)

    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Đọc file JSON
    const fileContent = fs.readFileSync(filePath, "utf8")
    const questions = JSON.parse(fileContent)

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error reading questions:", error)
    return NextResponse.json({ error: "Failed to read questions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { subjectId: string } }) {
  try {
    const subjectId = params.subjectId
    const filePath = path.join(process.cwd(), "data", `${subjectId}.json`)

    // Lấy dữ liệu từ request
    const questions: Question[] = await request.json()

    // Ghi dữ liệu vào file
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving questions:", error)
    return NextResponse.json({ error: "Failed to save questions" }, { status: 500 })
  }
}
