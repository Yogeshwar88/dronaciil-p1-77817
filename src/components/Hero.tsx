import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import ntsLogo from "@/assets/nts-logo.jpeg";
import ashokaEmblem from "@/assets/ashoka-emblem.jpeg";

const Hero = () => {
  const [currentLogo, setCurrentLogo] = useState(0);
  const logos = [ntsLogo, ashokaEmblem];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogo((prev) => (prev + 1) % logos.length);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Master Indian Languages & Earn National Certification
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Gain fluency in regional languages, prepare for NTS-I examinations,
              and unlock accredited certificates from the Central Institute of Indian
              Languages.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-6 text-base">
                Explore Courses
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-base font-semibold">
                Get Started
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="bg-card rounded-2xl shadow-lg p-12 border relative overflow-hidden">
              <img 
                src={logos[currentLogo]} 
                alt={currentLogo === 0 ? "NTS CCGS CIIL Mysore Logo" : "Ashoka Emblem"} 
                className="w-64 h-auto transition-opacity duration-500 animate-fade-in"
                key={currentLogo}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
