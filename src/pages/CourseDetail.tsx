import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Clock, 
  BookOpen, 
  ArrowLeft, 
  Users, 
  Award,
  CheckCircle2,
  Lock,
  Play
} from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  price: number;
  rating: number;
  enrolled_count: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_number: number;
  duration: string;
  is_preview: boolean;
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchCourseDetails();
  }, [courseId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
  };

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch course modules
      const { data: modulesData, error: modulesError } = await supabase
        .from("course_modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order_number", { ascending: true });

      if (modulesError) throw modulesError;
      setModules(modulesData || []);

      // Check if user is enrolled
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: enrollment } = await supabase
          .from("user_enrollments")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .single();

        setIsEnrolled(!!enrollment);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("user_enrollments")
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
          completed: false
        });

      if (error) throw error;

      setIsEnrolled(true);
      toast.success("Successfully enrolled in the course!");
      
      // Update enrollment count
      if (course) {
        await supabase
          .from("courses")
          .update({ enrolled_count: (course.enrolled_count || 0) + 1 })
          .eq("id", courseId);
      }
    } catch (error: any) {
      console.error("Error enrolling:", error);
      if (error.code === "23505") {
        toast.error("You are already enrolled in this course");
      } else {
        toast.error("Failed to enroll in course");
      }
    } finally {
      setEnrolling(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "intermediate": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "advanced": return "bg-red-500/10 text-red-700 dark:text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <p className="text-muted-foreground">Course not found</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold">NTS-I CIIL Learning</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
                <Badge variant="outline">{course.category}</Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold">{course.title}</h1>
              
              <p className="text-lg text-muted-foreground">{course.description}</p>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{course.enrolled_count || 0}</span>
                  <span className="text-muted-foreground">students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{course.duration}</span>
                  <span className="text-muted-foreground">duration</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm">Instructor: <span className="font-semibold">{course.instructor}</span></span>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image_url || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">₹{course.price.toLocaleString()}</p>
                  </div>
                  
                  {isEnrolled ? (
                    <Button className="w-full" size="lg" disabled>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Already Enrolled
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90" 
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  )}

                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">This course includes:</p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Lifetime access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{modules.length} comprehensive modules</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Interactive exercises</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content / Roadmap */}
      <section className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Course Curriculum</CardTitle>
            <CardDescription>
              {modules.length} modules • Learn at your own pace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{module.title}</h3>
                          {module.is_preview && (
                            <Badge variant="secondary" className="text-xs">
                              <Play className="h-3 w-3 mr-1" />
                              Preview
                            </Badge>
                          )}
                          {!module.is_preview && !isEnrolled && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default CourseDetail;
