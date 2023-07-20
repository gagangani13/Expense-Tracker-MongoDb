import React, { useEffect, useState } from "react";
import "./Downloads.css";
import axios from "axios";
import { useSelector } from "react-redux";
import DateFormat from "./DateFormat";
import { motion } from "framer-motion";
const Downloads = () => {
  const idToken = useSelector((state) => state.authenticate.idToken);
  const [downloads, setDownloads] = useState([]);
  useEffect(() => {
    viewDownload();
    // eslint-disable-next-line
  }, []);
  async function viewDownload() {
    const response = await axios.get("https://expense-tracker-backend-ndmg.onrender.com/viewDownloads", {
      headers: { Authorization: idToken },
    });
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error();
      }
      const arr = [];
      const data2 = data.downloads;
      for (let i in data2) {
        arr.push({
          date: data2[i].date,
          downloadLink: data2[i].downloadLink,
        });
      }
      setDownloads(arr);
    } catch (error) {
      alert(data.message);
    }
  }
  return (
      <motion.div
        className="downloads"
        initial={{ opacity: 0, x: "-100vw" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        >
        <h2>Downloads</h2>
        {downloads.length === 0 && <h3>No downloads!!</h3>}
        {downloads.map((item) => {
          return (
            <motion.li
              className="liItem"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "just" }}
            >
              <span>Downloaded on:</span>
              <DateFormat date={new Date(item.date)} />
              <a href={item.downloadLink}>Download again</a>
            </motion.li>
          );
        })}
      </motion.div>
  );
};

export default Downloads;
