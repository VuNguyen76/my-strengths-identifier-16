
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ENDPOINTS } from "@/config/api";
import ApiService from "@/services/api.service";
import { Service } from "@/types/service";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const Services = () => {
  const { data: services, isLoading, isError } = useQuery({
    queryKey: ['featuredServices'],
    queryFn: async () => {
      console.log("Fetching featured services");
      return ApiService.get<Service[]>(ENDPOINTS.SERVICES.FEATURED, { 
        requiresAuth: false 
      });
    }
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Dịch Vụ Của Chúng Tôi</h2>
            <p className="text-gray-600">Đang tải dịch vụ...</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((placeholder) => (
              <Card key={placeholder}>
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Dịch Vụ Của Chúng Tôi</h2>
            <p className="text-red-500">Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.</p>
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
          {services && services.length > 0 ? (
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
