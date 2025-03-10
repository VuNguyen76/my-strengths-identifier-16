
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-[600px] flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/placeholder.svg')] bg-cover bg-center">
          <div className="w-full h-full bg-black/50"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl font-bold mb-6">
            Chăm Sóc Da Chuyên Nghiệp
          </h1>
          <p className="text-xl mb-8">
            Khám phá các dịch vụ chăm sóc da cao cấp và được tư vấn bởi các chuyên gia hàng đầu
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link to="/booking">
                <CalendarDays className="mr-2" />
                Đặt lịch ngay
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/quiz">Kiểm tra da miễn phí</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
