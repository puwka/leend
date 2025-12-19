import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("data")
      .limit(1)
      .single();

    if (error) {
      console.error("Error reading documents:", error);
      return NextResponse.json(
        { message: "Error reading documents" },
        { status: 500 }
      );
    }

    return NextResponse.json(data?.data || { privacy: { sections: [] }, offer: { sections: [] } });
  } catch (error) {
    console.error("Error reading documents:", error);
    return NextResponse.json(
      { message: "Error reading documents" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const updatedDocuments = await request.json();

    // Проверяем, есть ли уже запись
    const { data: existing } = await supabaseAdmin
      .from("documents")
      .select("id")
      .limit(1)
      .single();

    if (existing) {
      // Обновляем существующую запись
      const { error } = await supabaseAdmin
        .from("documents")
        .update({ data: updatedDocuments })
        .eq("id", existing.id);

      if (error) {
        console.error("Error updating documents:", error);
        return NextResponse.json(
          { message: "Error updating documents" },
          { status: 500 }
        );
      }
    } else {
      // Создаём новую запись
      const { error } = await supabaseAdmin
        .from("documents")
        .insert({ data: updatedDocuments });

      if (error) {
        console.error("Error creating documents:", error);
        return NextResponse.json(
          { message: "Error creating documents" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: "Documents updated successfully" });
  } catch (error) {
    console.error("Error updating documents:", error);
    return NextResponse.json(
      { message: "Error updating documents" },
      { status: 500 }
    );
  }
}

