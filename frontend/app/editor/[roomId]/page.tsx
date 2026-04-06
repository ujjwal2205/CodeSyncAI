"use client";
import {useParams} from "next/navigation";
import CodeEditor from "@/components/editor";
export default function EditorPage(){
    const params=useParams();
    const roomId=params.roomId;
    return(<>
        <CodeEditor/>
        <div className="h-screen flex items-center justify-center">
            <h1 className="text-2xl">Room ID:{roomId}</h1>
        </div>
        </>
    )
}