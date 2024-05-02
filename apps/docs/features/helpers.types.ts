type OrPromise<T> = T | Promise<T>

type RecObj<RecKey extends string | number | symbol, T extends object> = T & {
  [key in RecKey]?: RecObj<RecKey, T>[]
}

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type { OrPromise, RecObj, WithRequired }
