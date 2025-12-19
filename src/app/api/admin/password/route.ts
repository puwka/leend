import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("admin")
      .select("password")
      .limit(1)
      .single();

    if (error) {
      console.error("Error reading admin config:", error);
      return NextResponse.json(
        { message: "Error reading admin config" },
        { status: 500 }
      );
    }

    // Не возвращаем пароль напрямую, только проверяем его существование
    return NextResponse.json({ exists: !!data?.password });
  } catch (error) {
    console.error("Error reading admin config:", error);
    return NextResponse.json(
      { message: "Error reading admin config" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Supabase не настроен" },
        { status: 500 }
      );
    }

    const { password, currentPassword } = await request.json();
    
    // Получаем текущий пароль из БД
    const { data: adminData, error: fetchError } = await supabaseAdmin
      .from("admin")
      .select("id, password")
      .limit(1)
      .single();
    
    if (fetchError || !adminData) {
      console.error("Error fetching admin:", fetchError);
      return NextResponse.json(
        { message: "Ошибка получения данных администратора" },
        { status: 500 }
      );
    }
    
    // Проверяем текущий пароль, если он указан
    if (currentPassword && currentPassword !== adminData.password) {
      return NextResponse.json(
        { message: "Неверный текущий пароль" },
        { status: 401 }
      );
    }
    
    // Обновляем пароль
    const { error: updateError } = await supabaseAdmin
      .from("admin")
      .update({ password })
      .eq("id", adminData.id);
    
    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json(
        { message: "Error updating password" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Error updating password" },
      { status: 500 }
    );
  }
}

