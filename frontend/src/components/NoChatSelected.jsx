import { useState } from "react";
import { MessageSquare } from "lucide-react";

export const NoChatSelected = () => {
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleOk = () => {
    setShowMessage(true);
  };

  const handleClose = () => {
    setIsClosed(true);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  /*
   * Window closed
   */
  if (isClosed) {
    return (
      <div className="w-full h-full bg-[#008080] flex items-center justify-center hidden lg:flex">

        <div className="text-center">

          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black flex items-center justify-center">
              <MessageSquare className="size-8 text-[#000080]" />
            </div>
          </div>

          <p className="text-white font-bold text-sm">
            Chat App is closed
          </p>

          <button
            onClick={() => setIsClosed(false)}
            className="mt-4 px-6 py-2 bg-[#c0c0c0] text-black text-sm font-bold border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
          >
            Open Chat App
          </button>

        </div>

      </div>
    );
  }

  /*
   * Minimized window
   */
  if (isMinimized) {
    return (
      <div className="w-full h-full bg-[#008080] relative">

        {/* Taskbar */}
        <div className="absolute bottom-2 left-2">

          <button
            onClick={handleMinimize}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#c0c0c0] text-black text-xs font-bold border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
          >
            <MessageSquare className="size-4 text-[#000080]" />
            Chat App
          </button>

        </div>

      </div>
    );
  }

  /*
   * Main window
   */
  return (
    <div className="w-full h-full bg-[#008080] flex items-center justify-center">

      <div
        className={`
          bg-[#c0c0c0]
          border-2 border-white
          border-r-black
          border-b-black
          shadow-[4px_4px_0px_#000]
          ${isMaximized
            ? "w-full h-full"
            : "w-full max-w-xl"
          }
        `}
      >

        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between">

          <div className="flex items-center gap-2 text-sm font-bold">
            <MessageSquare className="size-4" />
            Chat App
          </div>

          {/* Window Buttons */}
          <div className="flex gap-1">

            {/* Minimize */}
            <button
              onClick={handleMinimize}
              title="Minimize"
              className="w-5 h-5 bg-[#c0c0c0] text-black text-xs font-bold flex items-center justify-center border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
            >
              −
            </button>

            {/* Maximize */}
            <button
              onClick={handleMaximize}
              title="Maximize"
              className="w-5 h-5 bg-[#c0c0c0] text-black text-xs font-bold flex items-center justify-center border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
            >
              {isMaximized ? "❐" : "□"}
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              title="Close"
              className="w-5 h-5 bg-[#c0c0c0] text-black text-xs font-bold flex items-center justify-center border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
            >
              X
            </button>

          </div>

        </div>

        {/* Content */}
        <div className="p-6">

          {showMessage ? (

            /* Success message after OK */
            <div className="py-12 text-center">

              <div className="flex justify-center mb-5">

                <div className="w-20 h-20 bg-[#000080] flex items-center justify-center border-2 border-black">

                  <MessageSquare className="size-10 text-white" />

                </div>

              </div>

              <h2 className="text-xl font-bold text-black">
                Ready to Chat!
              </h2>

              <p className="text-sm text-black mt-2">
                Select someone from your contacts.
              </p>

              <p className="text-xs text-gray-700 mt-4">
                Opening your chat workspace...
              </p>

            </div>

          ) : (

            <>
              {/* Welcome */}
              <div className="flex gap-5 items-start">

                <div className="shrink-0">

                  <div className="w-20 h-20 bg-[#c0c0c0] flex items-center justify-center border-2 border-white border-r-black border-b-black">

                    <div className="w-14 h-14 bg-[#000080] flex items-center justify-center border-2 border-black">

                      <MessageSquare className="size-8 text-white" />

                    </div>

                  </div>

                </div>

                <div>

                  <h1 className="text-2xl font-bold text-black">
                    Welcome to Chat App
                  </h1>

                  <p className="text-sm text-black mt-2 leading-relaxed">
                    Your conversations are just one click away.
                    Select a contact from the list to begin chatting.
                  </p>

                </div>

              </div>

              {/* Separator */}
              <div className="my-6 border-t-2 border-gray-600 border-b border-white" />

              {/* Instructions */}
              <div className="flex gap-3 items-center">

                <div className="w-8 h-8 bg-[#c0c0c0] flex items-center justify-center border-2 border-white border-r-black border-b-black text-[#000080] font-bold">
                  1
                </div>

                <div>
                  <p className="text-sm font-bold text-black">
                    Select a contact
                  </p>

                  <p className="text-xs text-gray-700">
                    Choose someone from your contacts.
                  </p>
                </div>

              </div>

              <div className="flex gap-3 items-center mt-4">

                <div className="w-8 h-8 bg-[#c0c0c0] flex items-center justify-center border-2 border-white border-r-black border-b-black text-[#000080] font-bold">
                  2
                </div>

                <div>
                  <p className="text-sm font-bold text-black">
                    Start chatting
                  </p>

                  <p className="text-xs text-gray-700">
                    Send messages and share images.
                  </p>
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-2">

                <button
                  onClick={handleOk}
                  className="px-6 py-1.5 bg-[#c0c0c0] text-black text-sm font-bold border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
                >
                  OK
                </button>

              </div>
            </>
          )}

        </div>

        {/* Status Bar */}
        <div className="border-t-2 border-gray-600 px-2 py-1 flex justify-between text-xs text-black">

          <span>
            {showMessage ? "Starting..." : "Ready"}
          </span>

          <span>
            Connected
          </span>

        </div>

      </div>

    </div>
  );
};
