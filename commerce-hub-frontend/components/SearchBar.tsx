"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {

  const [search, setSearch] =
    useState("");

  const router =
    useRouter();

  const handleSearch =
    () => {

      if (!search.trim())
        return;

      router.push(
        `/search?q=${search}`
      );
    };

  return (
    <div className="flex gap-2">

      <input
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        placeholder="Search products..."
        className="
        px-4
        py-2
        rounded-xl
        bg-zinc-900
        border
        border-zinc-700
        "
      />

      <button
        onClick={
          handleSearch
        }
        className="
        bg-blue-600
        px-4
        rounded-xl
        "
      >
        Search
      </button>

    </div>
  );
}