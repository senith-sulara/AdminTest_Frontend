import { useEffect, useState } from "react";

function useBookmarks() {
  const [favorites, setBookmarks] = useState(() => {
    const ls = localStorage.getItem("favorites");
    if (ls) return JSON.parse(ls);
    else return [];
  });

  const toggleItemInLocalStorage = (id) => () => {
    const isBookmarked = favorites.includes(id);
    if (isBookmarked) setBookmarks((prev) => prev.filter((b) => b !== id));
    else setBookmarks((prev) => [...prev, id]);
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return [favorites, toggleItemInLocalStorage];
}

export default useBookmarks;