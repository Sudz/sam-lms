import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, Users, Star, Award, CheckCircle, PlayCircle } from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - will be replaced with API call
  const course = {
    id: 1,
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites',
    price: 2500,
    currency: 'ZAR',
    thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    duration_minutes: 480,
    level: 'Beginner',
    category: 'Technology',
    enrollment_count: 1250,
    rating: 4.8,
    instructor: {
      name: 'John Doe',
      bio: 'Senior Web Developer with 10+ years of experience',
    },
    modules: [
      {
        id: 1,
        title: 'Getting Started with HTML',
        order_index: 1,
        lessons: [
          { id: 1, title: 'Introduction to HTML', duration_minutes: 15, is_preview: true },
          { id: 2, title: 'HTML Elements and Tags', duration_minutes: 20, is_preview: false },
          { id: 3, title: 'Forms and Inputs', duration_minutes: 25, is_preview: false },
        ],
      },
      {
        id: 2,
        title: 'Styling with CSS',
        order_index: 2,
        lessons: [
          { id: 4, title: 'CSS Basics', duration_minutes: 20, is_preview: false },
          { id: 5, title: 'Flexbox and Grid', duration_minutes: 30, is_preview: false },
          { id: 6, title: 'Responsive Design', duration_minutes: 25, is_preview: false },
        ],
      },
    ],
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Badge variant="secondary" className="mr-2">{course.level}</Badge>
              <Badge variant="outline">{course.category}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{course.rating}</span>
                <span className="text-muted-foreground">({course.enrollment_count} students)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{Math.floor(course.duration_minutes / 60)} hours</span>
              </div>
            </div>

            <div className="aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-3xl">{course.currency} {course.price.toLocaleString()}</CardTitle>
                <CardDescription>One-time payment, lifetime access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button size="lg" className="w-full" onClick={() => navigate('/signup')}>
                  Enroll Now
                </Button>
                <Button size="lg" variant="outline" className="w-full">
                  Add to Wishlist
                </Button>
                
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Mobile and desktop access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Community support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content Tabs */}
        <Tabs defaultValue="curriculum" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>
                  {course.modules.length} modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module) => (
                    <AccordionItem key={module.id} value={`module-${module.id}`}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-semibold">{module.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {module.lessons.length} lessons • {module.lessons.reduce((acc, l) => acc + l.duration_minutes, 0)} min
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between py-2 border-b last:border-0">
                              <div className="flex items-center gap-3">
                                <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                <span>{lesson.title}</span>
                                {lesson.is_preview && (
                                  <Badge variant="secondary" className="text-xs">Preview</Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{lesson.duration_minutes} min</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructor" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About the Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold">{course.instructor.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{course.instructor.name}</h3>
                    <p className="text-muted-foreground">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
                <CardDescription>Coming soon</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
