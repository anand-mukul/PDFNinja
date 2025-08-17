import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import FooterToggle from "./ui/footer-mode-toggle";
import { Bug, FolderArchive } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Footer = () => {
  return (
    <footer className="inset-x-0 bottom-0 z-30 w-full border-t border-gray-200 bg-white/75 dark:bg-black/95 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="grid grid-cols-3 h-14 items-center">
          <Link
            href="https://github.com/anand-mukul/PDFNinja"
            className="flex z-40 font-semibold justify-start items-center gap-1 text-sm sm:text-base"
            aria-label="GitHub Repository"
          >
            <span className="hidden sm:inline">Give it a Star </span>
            <span aria-hidden="true">⭐</span>
          </Link>

          <div className="flex justify-center items-center space-x-3 sm:space-x-4">
            <TooltipProvider delayDuration={200}>
              <Link
                href="https://github.com/anand-mukul/PDFNinja/archive/refs/heads/main.zip"
                aria-label="Download Code"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <FolderArchive className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="mb-2 bg-gray-200 dark:bg-gray-950 text-black dark:text-white font-semibold rounded-full">
                    <p className="px-2 py-1">Download Code</p>
                  </TooltipContent>
                </Tooltip>
              </Link>

              <Link
                href="https://github.com/anand-mukul/PDFNinja/issues"
                target="_blank"
                aria-label="Report Issue"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Bug className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="mb-2 bg-gray-200 dark:bg-gray-950 text-black dark:text-white font-semibold rounded-full">
                    <p className="px-2 py-1">Report Issue</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </TooltipProvider>
          </div>

          <div className="flex justify-end">
            <FooterToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
