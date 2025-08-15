import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { Icons } from "./Icons";
import Link from "next/link";
import { Gem, CreditCard, LayoutDashboard, LogOut } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { Skeleton } from "./ui/skeleton";

interface UserAccountNavProps {
  email: string | undefined;
  name: string;
  imageUrl: string;
}

const UserAccountNav = async ({
  email,
  imageUrl,
  name,
}: UserAccountNavProps) => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 hover:bg-accent/80"
          aria-label="User account menu"
        >
          <Avatar className="h-8 w-8">
            {imageUrl ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  fill
                  src={imageUrl}
                  alt={`${name || "User"} profile picture`}
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-violet-500">
                <span className="sr-only">{name}</span>
                <Icons.user className="h-4 w-4 text-white" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-background/95 backdrop-blur-lg"
        align="end"
        sideOffset={8}
        collisionPadding={16}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {name && (
              <p className="text-sm font-medium leading-none truncate">
                {name}
              </p>
            )}
            {email && (
              <p className="text-xs leading-none text-muted-foreground truncate">
                {email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard" className="w-full">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            {subscriptionPlan?.isSubscribed ? (
              <Link href="/dashboard/billing" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Manage Subscription</span>
              </Link>
            ) : (
              <Link href="/pricing" className="w-full">
                <Gem className="mr-2 h-4 w-4 text-violet-500" />
                <span>Upgrade</span>
                <DropdownMenuShortcut className="text-violet-500">
                  PRO
                </DropdownMenuShortcut>
              </Link>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem asChild className="cursor-pointer">
          <LogoutLink className="flex w-full items-center text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserAccountNavSkeleton = () => (
  <Skeleton className="h-8 w-8 rounded-full" />
);

export default UserAccountNav;
