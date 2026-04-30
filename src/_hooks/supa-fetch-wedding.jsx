import { useState } from "react";
import { supabase } from "./supa-base-api";

export function useWedding() {

  const [dataWed, setdataWed]     = useState(null);
  const [loadWed, setloadWed]     = useState(false);
  const [errorWed, seterrorWed]   = useState(null);

  const fetchWed = async (code) => {
    try {
      setloadWed(true);
      seterrorWed(null);

      const { data, error } = await supabase
        .from("wedding_info")
        .select("*")
        .eq("code", code)
        .maybeSingle();

      if (error) throw error;

      setdataWed(data);
    } catch (err) {
      seterrorWed(err.message);
      setdataWed(null);
    } finally {
      setloadWed(false);
    }
  };

  return { dataWed, loadWed, errorWed, fetchWed };
}