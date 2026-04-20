"use client";

import { useParams } from "next/navigation";
import EditorRoom from "@/components/editorRoom";

export default function Page() {
  const { roomId } = useParams();

  return <EditorRoom roomId={roomId as string} />;
}