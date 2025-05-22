import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Giới Thiệu</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Về Hệ Thống Ôn Thi Trắc Nghiệm</CardTitle>
              <CardDescription>Nền tảng học tập hiện đại</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Hệ thống ôn thi trắc nghiệm là một nền tảng học tập trực tuyến được thiết kế để giúp sinh viên ôn tập và
                chuẩn bị cho các kỳ thi một cách hiệu quả. Hệ thống cung cấp các bài trắc nghiệm cho nhiều môn học khác
                nhau, giúp sinh viên kiểm tra kiến thức và cải thiện kết quả học tập.
              </p>
              <p>
                Với giao diện thân thiện và dễ sử dụng, hệ thống giúp sinh viên tiếp cận các câu hỏi trắc nghiệm một
                cách dễ dàng, đồng thời cung cấp phản hồi ngay lập tức để sinh viên có thể học hỏi từ những sai lầm của
                mình.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Các Môn Học</CardTitle>
              <CardDescription>Danh sách các môn học hiện có trên hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Xác Suất Thống Kê - Ôn tập các khái niệm và bài tập về xác suất và thống kê</li>
                <li>Sức Khỏe Môi Trường - Ôn tập kiến thức về sức khỏe và môi trường</li>
                <li>Toán Rời Rạc - Ôn tập các khái niệm và bài tập về toán rời rạc</li>
                <li>Kỹ Thuật Thương Mại Điện Tử - Ôn tập kiến thức về kỹ thuật thương mại điện tử</li>
                <li>Java 2 - Ôn tập kiến thức và bài tập về Java 2</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hướng Dẫn Sử Dụng</CardTitle>
              <CardDescription>Cách sử dụng hệ thống ôn thi trắc nghiệm</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Chọn môn học bạn muốn ôn tập từ trang chủ</li>
                <li>Làm bài trắc nghiệm theo thời gian quy định</li>
                <li>Xem kết quả và đáp án đúng sau khi hoàn thành bài thi</li>
                <li>Ôn tập lại những câu hỏi bạn đã làm sai</li>
                <li>Làm lại bài thi để cải thiện kết quả</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
