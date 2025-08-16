"use client";

import React, { useState } from "react";
import UploadButton from "./UploadButton";
import { trpc } from "@/app/_trpc/client";
import { Skeleton } from "./ui/skeleton";
import { Clock, File, Ghost, Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
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
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Documents
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {files?.length
                  ? `${files.length} document${
                      files.length > 1 ? "s" : ""
                    } stored`
                  : "Your uploaded documents will appear here"}
              </p>
            </div>
            <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-54 animate-pulse">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </CardHeader>

                <CardFooter className="flex justify-end py-3 border-t border-gray-100 dark:border-gray-800">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : files?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {files
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((file) => (
                <Card
                  key={file.id}
                  className="group transition-all hover:shadow-lg dark:hover:shadow-gray-800/30"
                >
                  <Link href={`/dashboard/${file.id}`} className="block">
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2.5 rounded-lg">
                          <File className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle
                            className="truncate text-lg font-semibold text-gray-900 dark:text-white 
             max-w-[calc(100%-12rem)] overflow-hidden whitespace-nowrap"
                          >
                            {file.name}
                          </CardTitle>

                          <CardDescription className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            {format(
                              new Date(file.createdAt),
                              "MMM dd, yyyy 'at' h:mm a"
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Link>
                  <CardFooter className="flex justify-end py-3 border-t border-gray-100 dark:border-gray-800">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 cursor-pointer mr-2"
                      aria-label={`Delete ${file.name}`}
                      onClick={(e) => {
                        e.preventDefault();
                        deleteFile({ id: file.id });
                      }}
                      disabled={!!deletingFile}
                    >
                      Delete
                      {deletingFile === file.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState
              title="No documents yet"
              description="Get started by uploading your first PDF"
              icon={<Ghost className="h-12 w-12 text-gray-400" />}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
