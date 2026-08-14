import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    // Get product stats
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, stock_quantity, minimum_stock, is_active");

    if (productsError) {
      console.error("Products stats error:", productsError);
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    // Get category count
    const { count: categoriesCount, error: categoriesError } = await supabase
      .from("categories")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);

    if (categoriesError) {
      console.error("Categories stats error:", categoriesError);
      return NextResponse.json({ error: categoriesError.message }, { status: 500 });
    }

    // Calculate stats
    const activeProducts = products?.filter((p) => p.is_active) || [];
    const lowStockProducts = activeProducts.filter(
      (p) => p.stock_quantity > 0 && p.stock_quantity <= p.minimum_stock
    );
    const outOfStockProducts = activeProducts.filter((p) => p.stock_quantity === 0);

    return NextResponse.json({
      data: {
        totalProducts: products?.length || 0,
        activeProducts: activeProducts.length,
        lowStockProducts: lowStockProducts.length,
        outOfStockProducts: outOfStockProducts.length,
        totalCategories: categoriesCount || 0,
      },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
