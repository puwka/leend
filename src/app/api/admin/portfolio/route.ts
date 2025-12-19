import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  client: string;
  duration: string;
  workers: number;
  created_at?: string;
  createdAt?: string;
}

// GET - Получить все кейсы
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error reading portfolio:", error);
      return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
    }

    // Преобразуем данные для совместимости с фронтендом
    const items = (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      client: item.client,
      duration: item.duration,
      workers: item.workers,
      createdAt: item.created_at || new Date().toISOString(),
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error reading portfolio:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

// POST - Создать новый кейс
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const newItem: PortfolioItem = await request.json();

    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .insert({
        id: newItem.id,
        title: newItem.title,
        description: newItem.description,
        image: newItem.image,
        category: newItem.category,
        client: newItem.client,
        duration: newItem.duration,
        workers: newItem.workers,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating portfolio item:", error);
      return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      item: {
        ...data,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

// PUT - Обновить кейс
export async function PUT(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const updatedItem: PortfolioItem = await request.json();

    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .update({
        title: updatedItem.title,
        description: updatedItem.description,
        image: updatedItem.image,
        category: updatedItem.category,
        client: updatedItem.client,
        duration: updatedItem.duration,
        workers: updatedItem.workers,
      })
      .eq("id", updatedItem.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating portfolio item:", error);
      return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      item: {
        ...data,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE - Удалить кейс
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const { id } = await request.json();

    const { error } = await supabaseAdmin
      .from("portfolio")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting portfolio item:", error);
      return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

