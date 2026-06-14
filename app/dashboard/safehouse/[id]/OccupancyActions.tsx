"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { UserPlus, Loader2 } from "lucide-react";
import { CheckInModal } from "./CheckInModal";
import { useSession } from "next-auth/react";

interface OccupancyActionsProps {
  id: string;
  occupied: number;
  capacity: number;
}

export const OccupancyActions: React.FC<OccupancyActionsProps> = ({
  id,
  occupied,
  capacity,
}) => {
  const { data: session } = useSession();
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  const isDP3A = session?.user?.role === "DP3A";

  if (!isDP3A) return null;

  return (
    <>
      <div className="pt-4 border-t border-outline-variant flex flex-col gap-3">
        <Button
          variant="primary"
          className="w-full gap-2"
          disabled={occupied >= capacity}
          onClick={() => setIsCheckInOpen(true)}
        >
          <UserPlus className="w-4 h-4" /> Check-in Penghuni
        </Button>
      </div>

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        safeHouseId={id}
      />
    </>
  );
};
