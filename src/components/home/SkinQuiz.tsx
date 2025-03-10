
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SkinQuiz = () => {
  return (
    <section className="py-24 bg-primary/5 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Khám phá loại da của bạn</h2>
            <p className="text-lg mb-8">
              Sử dụng công cụ trắc nghiệm da miễn phí của chúng tôi để nhận diện chính xác loại da 
              và nhận được gợi ý về các dịch vụ và sản phẩm phù hợp nhất.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex">
                <CheckCircle className="h-6 w-6 text-primary mr-3 shrink-0" />
                <p>Xác định chính xác loại da của bạn</p>
              </div>
              <div className="flex">
                <CheckCircle className="h-6 w-6 text-primary mr-3 shrink-0" />
                <p>Nhận gợi ý dịch vụ phù hợp</p>
              </div>
              <div className="flex">
                <CheckCircle className="h-6 w-6 text-primary mr-3 shrink-0" />
                <p>Tư vấn sản phẩm chăm sóc cá nhân hóa</p>
              </div>
              <div className="flex">
                <CheckCircle className="h-6 w-6 text-primary mr-3 shrink-0" />
                <p>Hoàn toàn miễn phí, chỉ mất 2 phút</p>
              </div>
            </div>
            
            <Button size="lg" asChild>
              <Link to="/quiz">Làm trắc nghiệm ngay</Link>
            </Button>
          </div>
          
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="Trắc nghiệm da"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg w-56 md:w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Kết quả của bạn:</span>
                <span className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-full">Mẫu</span>
              </div>
              <p className="font-bold text-lg">Da hỗn hợp thiên dầu</p>
              <div className="h-1 w-full bg-gray-200 rounded-full mt-2 mb-3">
                <div className="h-1 rounded-full bg-primary w-3/5"></div>
              </div>
              <p className="text-sm text-gray-600">Dựa trên 5/10 câu hỏi bạn đã trả lời</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkinQuiz;
