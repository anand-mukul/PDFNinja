import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { db } from '@/db';
import ChatWrapper from '@/components/chat/ChatWrapper';
import PdfRenderer from '@/components/PdfRenderer';

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = async({ params }: PageProps) => {
  // Extract fileid from params
  const { fileid } = params;

  // Get user session and user information
  const { getUser } = getKindeServerSession();
  const user = getUser();

  // Redirect if user is not logged in or user ID is not available
  if (!user || !user.id) {
    redirect(`/auth-callback?origin=dashboard/${fileid}`);
  }

  // Fetch file information for the given fileid and user ID
  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  });

  // Display 404 page if file is not found
  if (!file) {
    notFound();
  }

  // Get user's subscription plan
  const plan = await getUserSubscriptionPlan();

  return (
    <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        {/* Left sidebar & main wrapper */}
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            {/* Main area */}
            <PdfRenderer url={file.url} />
          </div>
        </div>

        {/* Right sidebar with chat */}
        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
