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
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 dark:bg-black/95 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link
            href="https://github.com/anand-mukul/PDFNinja"
            className="flex z-40 font-semibold justify-center items-center gap-1"
            aria-label="Link to GitHub Repository"
          >
            <span>Give it a Star ⭐</span>
          </Link>

          <div className="flex justify-center items-center space-x-4">
            {/* <Link
              href="/"
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 ease-in-out hover:underline"
              aria-label="Live Chat"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <MailPlus className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent className="mb-4 flex bg-gray-200 dark:bg-gray-950 text-black dark:text-white font-semibold rounded-full">
                    <p className="m-1">Live chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link> */}

            <Link
              href="https://github.com/anand-mukul/PDFNinja/archive/refs/heads/main.zip"
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 ease-in-out hover:underline"
              aria-label="Download Code"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <FolderArchive className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent className="mb-4 flex bg-gray-200 dark:bg-gray-950 text-black dark:text-white font-semibold rounded-full">
                    <p className="m-1">Download Code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>

            <Link
              href="https://github.com/anand-mukul/PDFNinja/issues"
              target="_blank"
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 ease-in-out hover:underline"
              aria-label="Report Issue"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Bug className="w-4 h-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="mb-4 flex bg-gray-200 dark:bg-gray-950 text-black dark:text-white font-semibold rounded-full">
                    <p className="m-1">Report Issue</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          </div>

          <div className="hidden items-center space-x-4 sm:flex">
            <FooterToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Footer;
