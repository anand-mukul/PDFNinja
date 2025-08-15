import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-background">
      <div className="max-w-8xl mx-auto px-4 py-6 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-foreground truncate max-w-md">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;