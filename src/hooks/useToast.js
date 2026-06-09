import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, duration = 2000) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  return { toast, showToast };
}
