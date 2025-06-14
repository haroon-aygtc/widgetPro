import React from "react";
import FooterLink from "./FooterLink";
import Logo from "./common/Logo";

interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

interface FooterSectionProps {
  columns?: FooterColumn[];
  companyName?: string;
  companyDescription?: string;
  copyrightText?: string;
  className?: string;
  showLogo?: boolean;
}

const defaultColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Documentation", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
];

const FooterSection: React.FC<FooterSectionProps> = ({
  columns = defaultColumns,
  companyName = "ChatWidget Pro",
  companyDescription = "The most powerful AI chat widget platform for modern businesses.",
  copyrightText = "© 2024 ChatWidget Pro. All rights reserved.",
  className,
  showLogo = true,
}) => {
  return (
    <footer className={`border-t bg-card py-12 px-4 ${className || ""}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {showLogo ? (
              <div className="mb-4">
                <Logo size="sm" />
              </div>
            ) : (
              <div className="mb-4">
                <span className="text-lg font-bold">{companyName}</span>
              </div>
            )}
            <p className="text-muted-foreground">{companyDescription}</p>
          </div>
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {column.links.map((link, linkIndex) => (
                  <FooterLink key={linkIndex} to={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
