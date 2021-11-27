import React, { useState } from "react";
import { useForm } from "../components/useForm";
import { instance } from "../axios";
import { CSVLink } from "react-csv";

export const PastPolls = () => {
  // defining the initial state for the form
  const initialState = {
    courseCode: "",
    startTime: "",
    endTime: "",
  };

  // getting the event handlers from our custom hook
  const { onChange, onSubmit, values } = useForm(
    downloadPollsCallback,
    initialState
  );
  const [csvData, setCSVData] = useState([]);
  const headers = [
    { label: "pollID", key: "pollID" },
    { label: "pollName", key: "pollName" },
    { label: "courseCode", key: "courseCode" },
    { label: "utorid", key: "utorid" },
    { label: "answer", key: "answer" },
    { label: "timestamp", key: "timestamp" },
  ];

  // a submit function that will execute upon form submission
  async function downloadPollsCallback() {
    // send "values" to database
    console.log(values);
    instance
      .get("/poll/students/", {
        params: values,
      })
      .then((res) => {
        setCSVData(res.data.responses);
      })
      .catch((err) => {
        // Display error after
        console.log(err);
      });
  }

  return (
    // don't mind this ugly form :P
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <input
            name="courseCode"
            id="courseCode"
            type="text"
            placeholder="Course Code: (for example, CSC207)"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            name="startTime"
            id="startTime"
            type="text"
            placeholder="Enter Time"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            name="endTime"
            id="endTime"
            type="text"
            placeholder="Enter Time"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <button type="submit">Download CSV</button>
        </div>
      </form>
      <div>
        <CSVLink
          headers={headers}
          data={csvData}
          filename={"data.csv"}
          className="btn"
        >
          Export to CSV ⬇
        </CSVLink>
      </div>
    </div>
  );
};
