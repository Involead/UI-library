"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

type Updater<T> = T | ((previous: T) => T);

/**
 * State that is controlled when `value` is defined and internal otherwise.
 * `onChange` fires for every update in both modes.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T | (() => T),
  onChange?: (value: T) => void,
): [T, (next: Updater<T>) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  // Latest value/handler, so the setter can stay referentially stable.
  const currentRef = useRef(current);
  const onChangeRef = useRef(onChange);
  const controlledRef = useRef(isControlled);

  useLayoutEffect(() => {
    currentRef.current = current;
    onChangeRef.current = onChange;
    controlledRef.current = isControlled;
  });

  const setValue = useCallback((next: Updater<T>) => {
    const resolved =
      typeof next === "function"
        ? (next as (previous: T) => T)(currentRef.current)
        : next;
    if (Object.is(resolved, currentRef.current)) return;

    currentRef.current = resolved;
    if (!controlledRef.current) setInternal(resolved);
    onChangeRef.current?.(resolved);
  }, []);

  return [current, setValue];
}
