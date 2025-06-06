// Định nghĩa kiểu dữ liệu cho câu hỏi
export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

// Hàm để lấy dữ liệu câu hỏi từ file JSON tương ứng
export const getQuestions = async (subjectId: string): Promise<Question[]> => {
  try {
    // Fetch data from the API
    const response = await fetch(`/api/questions/${subjectId}`)
    if (!response.ok) {
      throw new Error(`Error fetching questions: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Lỗi khi tải câu hỏi:", error)
    return []
  }
}

// Hàm để lưu câu hỏi vào file JSON
export const saveQuestions = async (subjectId: string, questions: Question[]): Promise<boolean> => {
  try {
    // Trong môi trường thực tế, bạn sẽ lưu dữ liệu vào file JSON
    // Ví dụ:
    // const response = await fetch(`/api/questions/${subjectId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(questions),
    // });
    // return response.ok;

    // Hiện tại giả lập thành công
    return true
  } catch (error) {
    console.error("Lỗi khi lưu câu hỏi:", error)
    return false
  }
}
