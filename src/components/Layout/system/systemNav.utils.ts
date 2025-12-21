// src/components/Layout/system/systemNav.utils.ts
import type { MenuProps } from "antd";

type ItemType = NonNullable<MenuProps["items"]>[number];

const isObject = (v: unknown): v is Record<string, any> =>
  typeof v === "object" && v !== null;

const hasChildren = (item: ItemType): item is ItemType & { children: ItemType[] } => {
  return isObject(item) && "children" in item && Array.isArray((item as any).children);
};

const getKey = (item: ItemType): string | null => {
  if (!isObject(item)) return null;
  return typeof (item as any).key === "string" ? (item as any).key : null;
};

const getChildren = (item: ItemType): ItemType[] => {
  if (!hasChildren(item)) return [];
  return item.children;
};

// ví dụ flatten
export const flattenMenuKeys = (items: ItemType[]): string[] => {
  const out: string[] = [];

  const walk = (arr: ItemType[]) => {
    arr.forEach((it) => {
      const k = getKey(it);
      if (k) out.push(k);

      const children = getChildren(it);
      if (children.length) walk(children);
    });
  };

  walk(items);
  return out;
};


export const getSelectedKeyByLocation = (
  pathname: string,
  items: ItemType[],
  fallback?: string
): string => {
  const keys = flattenMenuKeys(items).filter((k) => k !== "companies" && k !== "taxonomy" && k !== "content");

  // exact match first
  if (keys.includes(pathname)) return pathname;

  // longest prefix match (works for detail routes)
  let best = "";
  for (const k of keys) {
    if (k && pathname.startsWith(k) && k.length > best.length) best = k;
  }

  return best || fallback || keys[0] || pathname;
};

export const getOpenKeysBySelectedKey = (
  selectedKey: string,
  items: ItemType[]
): string[] => {
  const open: string[] = [];

  const dfs = (arr: ItemType[], parents: string[]) => {
    for (const it of arr) {
      const k = getKey(it);
      const kids = getChildren(it);

      if (kids.length) {
        const nextParents = k ? [...parents, k] : parents;
        // if any descendant matches selectedKey prefix, open this group
        const descendantKeys = flattenMenuKeys(kids);
        if (
          descendantKeys.some((dk) => dk === selectedKey || selectedKey.startsWith(dk))
        ) {
          if (k) open.push(k);
        }
        dfs(kids, nextParents);
      }
    }
  };

  dfs(items, []);
  return Array.from(new Set(open));
};
