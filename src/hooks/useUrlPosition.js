import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchPrams, setSearchPrams] = useSearchParams();
  const lat = searchPrams.get("lat");
  const lng = searchPrams.get("lng");

  return { lat, lng };
}
