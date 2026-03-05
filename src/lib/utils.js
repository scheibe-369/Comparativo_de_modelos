import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Função utilitária padrão do shadcn para mesclar classes Tailwind.
 * Nota: Certifique-se de instalar 'clsx' e 'tailwind-merge' via npm.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
