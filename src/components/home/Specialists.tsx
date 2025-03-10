
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Specialist {
  id: string;
  name: string;
  role: string;
  experience: string;
  image: string;
}

const Specialists = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/specialists/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch specialists');
        }
        const data = await response.json();
        setSpecialists(data);
      } catch (error) {
        console.error('Error fetching specialists:', error);
        toast.error('Không thể tải thông tin chuyên viên. Vui lòng thử lại sau.');
        // Use empty array if API fails
        setSpecialists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Đội Ngũ Chuyên Viên</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đang tải thông tin chuyên viên...
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((placeholder) => (
              <Card key={placeholder} className="text-center animate-pulse">
                <div className="h-72 bg-gray-200 rounded-t-lg"></div>
                <CardHeader className="pt-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mx-auto mt-2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Đội Ngũ Chuyên Viên</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đội ngũ chuyên viên giàu kinh nghiệm của chúng tôi luôn sẵn sàng tư vấn và chăm sóc làn da của bạn với những 
            dịch vụ chất lượng cao
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {specialists.length > 0 ? (
            specialists.map((specialist) => (
              <Card key={specialist.id} className="text-center overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={specialist.image || '/placeholder.svg'} 
                    alt={specialist.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <Badge variant="secondary" className="self-center mb-4 hover:bg-primary hover:text-white transition-colors">
                      <Link to="/booking">Đặt lịch ngay</Link>
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pt-6">
                  <CardTitle>{specialist.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-primary">{specialist.role}</p>
                    <p className="text-sm text-gray-500">{specialist.experience}</p>
                  </div>
                  <Button variant="outline" className="mt-2" asChild>
                    <Link to={`/specialists/${specialist.id}`}>Xem chi tiết</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p>Chưa có thông tin chuyên viên nào. Vui lòng quay lại sau.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/specialists">Xem tất cả chuyên viên</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Specialists;
