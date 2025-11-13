import { Star } from "lucide-react";

interface CourseCardProps {
  code: string;
  codeColor: string;
  bgColor: string;
  university: string;
  title: string;
  description: string;
  rating: number;
  reviews: string;
  type: string;
  typeColor: string;
}

const CourseCard = ({
  code,
  codeColor,
  bgColor,
  university,
  title,
  description,
  rating,
  reviews,
  type,
  typeColor,
}: CourseCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className={`${bgColor} py-12 flex items-center justify-center`}>
        <h3 className={`text-4xl font-bold ${codeColor}`}>{code}</h3>
      </div>
      
      <div className="p-6 space-y-3">
        <p className="text-xs text-muted-foreground">{university}</p>
        <h4 className="font-semibold text-foreground text-base">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="flex items-center gap-1 pt-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
        </div>
        
        <p className={`text-sm font-semibold ${typeColor} pt-2`}>{type}</p>
      </div>
    </div>
  );
};

export default CourseCard;
