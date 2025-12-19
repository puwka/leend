import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Supabase не настроен" },
        { status: 500 }
      );
    }

    // Получаем пароль из БД
    const { data, error } = await supabaseAdmin
      .from("admin")
      .select("password")
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error("Error fetching admin:", error);
      return NextResponse.json(
        { success: false, message: "Ошибка аутентификации" },
        { status: 500 }
      );
    }
    
    if (password === data.password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Неверный пароль" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error authenticating:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка аутентификации" },
      { status: 500 }
    );
  }
}

