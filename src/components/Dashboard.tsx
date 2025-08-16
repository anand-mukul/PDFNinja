"use client";

import React, { useState } from "react";
import UploadButton from "./UploadButton";
import { trpc } from "@/app/_trpc/client";
import { Skeleton } from "./ui/skeleton";
import { Clock, Ghost, Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import EmptyState from "./EmptyState";

interface PageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const Dashboard = ({ subscriptionPlan }: PageProps) => {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onMutate: ({ id }) => {
      setDeletingFile(id);
      return { previousFiles: utils.getUserFiles.getData() };
    },
    onError: (_, __, context) => {
      utils.getUserFiles.setData(undefined, context?.previousFiles);
    },
    onSettled: () => {
      setDeletingFile(null);
      utils.getUserFiles.invalidate();
    },
  });

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            My Files
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {files?.length
              ? `${files.length} document${files.length > 1 ? "s" : ""}`
              : "Your uploaded documents will appear here"}
          </p>
        </div>
        <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
      </header>

      {/* File Grid */}
      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : files?.length ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <Card
                key={file.id}
                className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-gray-700/50 group"
              >
                <Link href={`/dashboard/${file.id}`} className="block">
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg p-2">
                        <div className="bg-white dark:bg-gray-900 w-8 h-8 rounded flex items-center justify-center">
                          <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-violet-500">
                            PDF
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                          {file.name}
                        </CardTitle>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {format(new Date(file.createdAt), "MMM dd, yyyy")}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1.5" />
                      <span>{format(new Date(file.createdAt), "h:mm a")}</span>
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="flex justify-end py-3 border-t border-gray-100 dark:border-gray-800">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label={`Delete ${file.name}`}
                        onClick={(e) => {
                          e.preventDefault();
                          deleteFile({ id: file.id });
                        }}
                        disabled={!!deletingFile}
                      >
                        {deletingFile === file.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Delete document</p>
                    </TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No documents yet"
            description="Get started by uploading your first PDF"
            icon={<Ghost className="h-12 w-12 text-gray-400" />}
          />
        </div>
      )}
    </main>
  );
};

export default Dashboard;
