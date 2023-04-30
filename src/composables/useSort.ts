import { useState } from "nuxt/app";

export const sortTypes = ["Prijs"] as const;

export type SortType = (typeof sortTypes)[number];
export type SortOrder = "ASC" | "DES";
export type Sort = { type: SortType; sortOrder: SortOrder };

const useSort = () => {
  const sort = useState<Sort | undefined>("sort");

  const setSort = (type: SortType) => {
    let newSort: Sort | undefined = undefined;

    if (!sort.value || sort.value.type !== type) {
      newSort = { type, sortOrder: "ASC" };
    }
    if (sort.value?.sortOrder === "ASC") {
      newSort = { type, sortOrder: "DES" };
    }
    if (sort.value?.sortOrder === "DES") {
      newSort = undefined;
    }

    sort.value = newSort;
  };

  return [sort, setSort] as const;
};

export default useSort;
