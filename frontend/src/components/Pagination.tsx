import React, { SetStateAction } from "react";

type Props = {
  noOfPages: number;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
};

const Pagination = ({ noOfPages, page, setPage }: Props) => {
  let pageNums = [];
  for (let i = 1; i <= noOfPages; i++) {
    pageNums.push(i);
  }
  return (
    <>
      <div className="flex items-center justify-center gap-2 p-2 rounded-lg">
        {pageNums.map((pageNum, i) => {
          return (
            <div
              onClick={() => setPage(pageNum)}
              className={`border cursor-pointer rounded-xl p-2 ${
                page === pageNum ? "bg-black text-white" : ""
              }`}
              key={i}
            >
              {pageNum}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Pagination;
