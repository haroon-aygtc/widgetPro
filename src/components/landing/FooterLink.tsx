import React from "react";
import { Link } from "react-router-dom";

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children, className }) => {
  return (
    <li>
      <Link 
        to={to} 
        className={`hover:text-foreground transition-colors ${className || ""}`}
      >
        {children}
      </Link>
    </li>
  );
};

export default FooterLink;
