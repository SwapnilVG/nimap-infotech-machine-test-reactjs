import React, { useEffect, useState } from "react";
import { URL } from "../utils/constant";
import Header from "./Header";
import Card from "../components/Card";
import Loading from "./Loading";

const ITEMS_PER_PAGE = 8;

const Home = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    if (data && searchQuery.trim() !== "") {
      const filtered = data.filter((item) =>
        item.original_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to first page on new search
    } else {
      setFilteredData(data);
    }
  }, [data, searchQuery]);

  async function getAllData() {
    try {
      const apiData = await fetch(URL);
      const res = await apiData.json();
      setData(res.results);
      setLoading(false);
      setFilteredData(res.results);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setLoading(false);
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="cards-container">
        {currentData.map((item) => (
          <Card {...item} key={item.id} />
        ))}
      </div>
      <div className="pagination-controls flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Home;
