
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/config/api";
import ApiService from "@/services/api.service";

interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
}

const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await ApiService.get<Blog[]>(ENDPOINTS.BLOGS.FEATURED, { 
          requiresAuth: false 
        });
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bài Viết Nổi Bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đang tải bài viết...
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((placeholder) => (
              <Card key={placeholder} className="animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
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
          <h2 className="text-3xl font-bold mb-4">Bài Viết Nổi Bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kiến thức và bí quyết chăm sóc da từ các chuyên gia hàng đầu
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={blog.image || '/placeholder.svg'} 
                    alt={blog.title}
                    className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{blog.date}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.author}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">
                    {blog.description}
                  </CardDescription>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/blog/${blog.id}`}>Đọc tiếp</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p>Chưa có bài viết nào. Vui lòng quay lại sau.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/blog">Xem tất cả bài viết</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
