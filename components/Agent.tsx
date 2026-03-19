"use client";
// This Agent has to be rendered on the client side

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

interface SavedMessages {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessages[]>([]);

  const lastMessage = messages[messages.length - 1];

  // call when starting the call
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {role: message.role, content: message.transcript};

        setMessages((prev) => [...prev, newMessage]);
      }
    }

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log("Call error:", error);

    // Listen to VAPI events
    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    // Cleanup listeners on unmount
    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    }
  }, [])

  // execute when anything changes in the call status
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      router.push("/");
    }

    const handleCall = async() => {
      setCallStatus(CallStatus.CONNECTING);
 
      if (type === "generate") {
        await vapi.start(
          // vapi.start checks if Agent was defined, then falls back to Workflow if necessary
          // we have to explicitly set Agent undefined --> to use the Workflow defined in the VAPI dashboard
          undefined, 
          undefined,
          undefined,
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
        );

      }
    }

    const handleDisconnect = async() => {}
  }, [messages, callStatus, type, userId]);

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card Profile*/}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-30"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {/* Convo Transcript */}
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100",
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Statucs Call Button */}
      <div className="w-full flex justify-center">
        {/* check Call Status  */}
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call">
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden",
              )}
            />

            <span>
              {/* ... for connecting */}
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};

export default Agent;
