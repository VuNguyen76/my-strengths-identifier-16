
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/services/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Không thể tải dịch vụ. Vui lòng thử lại sau.');
        // Use empty array if API fails
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Dịch Vụ Của Chúng Tôi</h2>
            <p className="text-gray-600">Đang tải dịch vụ...</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((placeholder) => (
              <Card key={placeholder} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-gray-600">Khám phá các dịch vụ chăm sóc da chuyên nghiệp</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service) => (
              <Card key={service.id}>
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img 
                    src={service.image || '/placeholder.svg'} 
                    alt={service.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link to={`/services/${service.id}`}>Xem chi tiết</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p>Chưa có dịch vụ nào. Vui lòng quay lại sau.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link to="/services">Xem tất cả dịch vụ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
