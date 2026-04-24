import React, { useEffect, useRef } from "react";

export default function VideoCallModal({ isOpen, onClose, localStream, remoteStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-xl p-4 flex flex-col items-center gap-4 relative w-[90vw] max-w-md">
        <button className="absolute top-2 right-2 btn btn-sm btn-error" onClick={onClose}>X</button>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-64 bg-black rounded mb-2" />
        <video ref={localVideoRef} autoPlay playsInline muted className="w-24 h-24 bg-black rounded absolute bottom-8 right-8 border-2 border-white" style={{zIndex:2}} />
        <div className="mt-4">
          <button className="btn btn-error" onClick={onClose}>End Call</button>
        </div>
      </div>
    </div>
  );
}
