"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function updateOrderStatus(summaryId: string, newStatus: string) {
  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase
    .from("order_summary")
    .update({ status: newStatus })
    .eq("id", summaryId)

  return !error
}
