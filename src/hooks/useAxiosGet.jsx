import axios from "axios";
import { useEffect, useState } from "react";

export function useAxiosGet(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("entry in useAxixosGet " + url)
    const abortController = new AbortController();
    axios
      .get(url, { signal: abortController.signal })
      .then((res) => {
        // console.log(res)
        setData(res.data);
        // console.log(res.data)
        setError(null);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response)
          setError(err.response.data.error);
        } else if (err.name !== "CanceledError") {
          // request will be aborted once in strict more because I'm using abort controller
          // & it will throw CanceledError when it aborts so accounting for that
          setError(err.message);
          console.log(err.message)
        }
      });

    return () => abortController.abort();
  }, [url]);

  return { data, setData, error, setError };
}
