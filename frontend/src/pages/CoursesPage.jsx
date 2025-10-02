import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, Users, Star } from 'lucide-react';

export default function CoursesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Mock data - will be replaced with API calls
  const courses = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript',
      price: 2500,
      currency: 'ZAR',
      thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      duration_minutes: 480,
      level: 'Beginner',
      category: 'Technology',
      enrollment_count: 1250,
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Digital Marketing Essentials',
      description: 'Master the art of digital marketing and social media',
      price: 1800,
      currency: 'ZAR',
      thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      duration_minutes: 360,
      level: 'Intermediate',
      category: 'Marketing',
      enrollment_count: 890,
      rating: 4.6,
    },
    {
      id: 3,
      title: 'Data Science with Python',
      description: 'Analyze data and build machine learning models',
      price: 3200,
      currency: 'ZAR',
      thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      duration_minutes: 720,
      level: 'Advanced',
      category: 'Technology',
      enrollment_count: 2100,
      rating: 4.9,
    },
  ];

  const categories = ['All', 'Technology', 'Business', 'Marketing', 'Design', 'Personal Development'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-muted-foreground text-lg">
            Discover courses that match your interests and skill level
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level.toLowerCase()}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(course.duration_minutes / 60)}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrollment_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {course.currency} {course.price.toLocaleString()}
                </div>
                <Button onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/courses/${course.id}`);
                }}>
                  View Course
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
