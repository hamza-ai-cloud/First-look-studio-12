import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type PublicBranch = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  hours: string | null;
  maps_url: string | null;
  whatsapp_url: string | null;
  display_phone: string | null;
  is_active: boolean;
  sort_order: number;
};

export async function getPublicBranches(): Promise<PublicBranch[]> {
  const { data, error } = await supabaseAdmin
    .from("branches")
    .select(
      "id,name,address,phone,email,hours,maps_url,whatsapp_url,display_phone,is_active,sort_order"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load public branches:", error);
    return [];
  }

  return (data || []) as PublicBranch[];
}
