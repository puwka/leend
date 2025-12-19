import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "privacy" or "offer"
    
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
    
    const documents = data?.data || { privacy: { sections: [] }, offer: { sections: [] } };
    
    if (type && (type === "privacy" || type === "offer")) {
      return NextResponse.json(documents[type]);
    }
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error reading documents:", error);
    return NextResponse.json(
      { message: "Error reading documents" },
      { status: 500 }
    );
  }
}

