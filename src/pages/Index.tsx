import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TopCourses from "@/components/TopCourses";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <TopCourses />
      <CTASection />
    </div>
  );
};

export default Index;
