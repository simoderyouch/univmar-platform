import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = { title: string; children: ReactNode; onClose: () => void };

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#110703]/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#e3d8d1] bg-white p-6 shadow-[0_24px_70px_rgba(17,7,3,0.28)] focus:outline-none">
          <div className="flex items-center justify-between gap-4">
            <Dialog.Title className="font-serif text-2xl tracking-[-0.02em] text-[#21140f]">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close" className="rounded-md p-1.5 text-[#796c64] transition hover:bg-[#f4ece8] hover:text-[#21140f]">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
