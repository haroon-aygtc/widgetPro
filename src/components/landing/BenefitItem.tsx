import React from "react";
import { CheckCircle } from "lucide-react";

interface BenefitItemProps {
  text: string;
  className?: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ text, className }) => {
  return (
    <div className={`flex items-center ${className || ""}`}>
      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
};

export default BenefitItem;
