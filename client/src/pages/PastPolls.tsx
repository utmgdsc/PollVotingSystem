import React, { useEffect, useState } from "react";
import { instance } from "../axios";
import { CSVDownload } from "react-csv";
import { Button } from "../components/Button";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Header } from "../components/Header";
import { FormInput } from "../components/FormInput";

interface VoteData {
  answer: number;
  courseCode: string;
  pollID: string;
  pollName: string;
  timestamp: string;
  utorid: string;
}

export const PastPolls = () => {
  const [pollInfo, setPollInfo] = useState({
    startTime: new Date(),
    endTime: new Date(),
    courseCode: "",
  });
  const [mandatoryField, setMandatoryField] = useState("");
  const [downloadStatus, setDownloadStatus] = useState({
    fetchedData: false,
    status: "",
  });
  const [csvData, setCSVData] = useState<VoteData[]>([]);
  const headers = [
    { label: "pollId", key: "pollId" },
    { label: "pollName", key: "pollName" },
    { label: "courseCode", key: "courseCode" },
    { label: "utorid", key: "utorid" },
    { label: "question", key: "sequence" },
    { label: "answer", key: "answer" },
    { label: "timestamp", key: "timestamp" },
    { label: "description", key: "description" },
  ];

  // Times are returned in UTC format
  const downloadPollData = async () => {
    if (pollInfo.courseCode === "") {
      setMandatoryField("Course Code is required");
      return;
    }
    setMandatoryField("");
    setDownloadStatus({ ...downloadStatus, status: "Downloading..." });
    await instance
      .get("/poll/students/", {
        params: {
          courseCode: pollInfo.courseCode,
          startTime: pollInfo.startTime,
          endTime: pollInfo.endTime,
        },
      })
      .then((res) => {
        if (res.data.responses.length > 0) {
          // eslint-disable-next-line no-console
          console.log(res.data.responses);
          setCSVData(res.data.responses);
          setDownloadStatus({ ...downloadStatus, fetchedData: true });
        } else {
          setDownloadStatus({
            ...downloadStatus,
            status: "No poll data found",
          });
        }
      })
      .catch(() => {
        // Display error after
        setDownloadStatus({
          ...downloadStatus,
          status: "Unable to download poll data",
        });
      });
  };
  useEffect(() => {
    if (downloadStatus.fetchedData) {
      setDownloadStatus({ ...downloadStatus, fetchedData: false, status: "" });
    }
  }, [downloadStatus.fetchedData]);

  return (
    <div>
      <Header text={"Download Past Poll Results"} />
      <FormInput
        placeholder={"Course Code"}
        onChangeHandler={(courseCode) =>
          setPollInfo({ ...pollInfo, courseCode })
        }
        pollValue={pollInfo.courseCode}
      />
      <div className={"mt-3 text-center text-red-500"}>{mandatoryField}</div>
      <div className={"text-center"}>
        <Header text={"Start Time"} primary={false} />
        <ReactDatePicker
          className={
            "py-2 px-4 focus:outline-none text-center border border-black"
          }
          selected={pollInfo.startTime}
          showTimeSelect
          dateFormat={"Pp"}
          onChange={(date) => {
            if (date instanceof Date) {
              setPollInfo({ ...pollInfo, startTime: date });
            }
          }}
        />
      </div>
      <div className={"text-center"}>
        <Header text={"End Time"} primary={false} />
        <ReactDatePicker
          className={
            "py-2 px-4 focus:outline-none text-center border border-black"
          }
          selected={pollInfo.endTime}
          showTimeSelect
          dateFormat={"Pp"}
          onChange={(date) => {
            if (date instanceof Date) {
              setPollInfo({ ...pollInfo, endTime: date });
            }
          }}
        />
      </div>
      {downloadStatus.fetchedData ? (
        <CSVDownload headers={headers} data={csvData} filename={"data.csv"} />
      ) : null}
      <div className={"text-center"}>
        <Button
          className={"mt-5"}
          value={"Download Poll Results"}
          onClick={() => downloadPollData()}
        />
      </div>

      <div className={"text-center mt-4"}>{downloadStatus.status}</div>
    </div>
  );
};
