"use client";

export default function ChatCtaButton() {
  return (
    <button
      type="button"
      onClick={() => {
        const launcher = document.querySelector<HTMLButtonElement>("#aw-launcher");
        if (launcher) launcher.click();
      }}
      className="mt-6 mx-auto block rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-400 sm:mt-8 sm:py-3.5"
    >
      Chat With Us
    </button>
  );
}
