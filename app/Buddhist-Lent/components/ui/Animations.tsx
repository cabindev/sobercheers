// app/Buddhist2025/components/ui/Animations.tsx
export const fadeIn = "animate-in fade-in slide-in-from-bottom-4 duration-500";
export const slideIn = "animate-in slide-in-from-left-4 duration-300";
export const zoomIn = "animate-in zoom-in-50 duration-200";

// Stagger animation for form sections
export const staggerChildren = {
  container: "space-y-8",
  item: (index: number) => `animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[${index * 100}ms]`
};