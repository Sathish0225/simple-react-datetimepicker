import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import DatePicker from "../src/DatePicker";
import TimePicker from "../src/TimePicker";
import DateTimePicker from "../src/DateTimePicker";
import DateRangePicker from "../src/DateRangePicker";
import DateTimeRangePicker from "../src/DateTimeRangePicker";

const App = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [datetime, setDateTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  return (
    <div className="container">
      <div className="row" style={{ marginTop: "50px" }}>
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <h1 style={{ textAlign: "center" }}>Package Testing</h1>
          <DatePicker selected={date} onChange={(date) => setDate(date)} />
          <br />
          <TimePicker selected={time} onChange={(time) => setTime(time)} />
          <br />
          <DateTimePicker
            selected={datetime}
            onChange={(datetime) => setDateTime(datetime)}
          />
          <br />
          <DateRangePicker
            selected={{ startDate, endDate }}
            onChange={({ startDate, endDate }) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
          />
          <br />
          <DateTimeRangePicker
            selected={{ startDateTime, endDateTime }}
            onChange={({ startDateTime, endDateTime }) => {
              setStartDateTime(startDateTime);
              setEndDateTime(endDateTime);
            }}
          />
        </div>
        <div className="col-md-4"></div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
