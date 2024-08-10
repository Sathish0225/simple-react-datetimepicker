/* eslint-disable no-loop-func */
import React, { useState, useRef, useEffect } from "react";
import { CiClock2 } from "react-icons/ci";
import { format, parse } from "date-fns";
import "./TimePicker.css";

import "bootstrap/dist/css/bootstrap.min.css";

// Define valid time formats
const VALID_TIME_FORMATS = [
  "hh:mm a",
  "hh:mm:ss a",
  "HH:mm",
  "HH:mm:ss",
  "HH:mm:ss.SSS'Z'",
  "h:mm a",
  "h:mm:ss a",
  "H:mm",
  "H:mm:ss",
  "H:mm:ss.SSS'Z'",
];

// Utility function to validate time format
const isValidTimeFormat = (formatString) => {
  return VALID_TIME_FORMATS.includes(formatString);
};

const TimePicker = (props) => {
  const [pickedTime, setPickedTime] = useState("");
  const [pickerShow, setPickerShow] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const inputRef = useRef(null);
  const pickerRef = useRef(null);

  const timeFormat = isValidTimeFormat(props.timeformat)
    ? props.timeformat
    : "HH:mm:ss";

  const handleTimeChange = () => {
    setPickerShow(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setPickerShow(false);
      }
    };

    if (pickerShow) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerShow]);

  useEffect(() => {
    if (pickerShow && inputRef.current && pickerRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      // pickerRef.current.style.left = `${inputRect.left + window.scrollX}px`;
    }
  }, [pickerShow]);

  useEffect(() => {
    if (props.selected) {
      const parsedTime = parse(props.selected, timeFormat, new Date());
      if (!isNaN(parsedTime)) {
        const formattedDate = format(parsedTime, timeFormat);
        setPickedTime(formattedDate);
        setSelectedTime(parsedTime);
      }
    }
  }, [props.selected, timeFormat]);

  const handleTimeSelect = (date) => {
    const newDate = new Date(date);
    const formattedDate = format(newDate, timeFormat);
    setPickedTime(formattedDate);
    setSelectedTime(newDate);

    if (props.onChange) {
      props.onChange(formattedDate);
    }
  };

  const handleClear = () => {
    setPickedTime("");
    setSelectedTime(new Date());
    setPickerShow(false);

    if (props.onChange) {
      props.onChange("");
    }
  };

  const handleToday = () => {
    const today = new Date();
    handleTimeSelect(today);
    setPickerShow(false);
  };

  return (
    <>
      <div className="time-picker">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            name={props.name}
            id={props.id}
            className={props.className ?? "form-control r-input c-input"}
            value={pickedTime}
            readOnly
            onClick={handleTimeChange}
            placeholder={props.placeholder ?? "Select Time"}
          />
          <span onClick={handleTimeChange} className={"input-group-text i-sufix text-dark"}>
            <CiClock2 size={16} />
          </span>
        </div>
        {pickerShow && (
          <div ref={pickerRef} className="picker">
            <TimeView
              selectedTime={selectedTime}
              handleTimeSelect={handleTimeSelect}
            />
            <div className="button">
              <div className="buttons">
                <button onClick={handleClear} className="clear-button">
                  Clear
                </button>
                <button onClick={handleToday} className="today-button">
                  Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const TimeView = ({ selectedTime, handleTimeSelect }) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    if (selectedTime instanceof Date && !isNaN(selectedTime)) {
      let hours = selectedTime.getHours();
      let mins = selectedTime.getMinutes();

      setHour(hours);
      setMinute(mins);
    }
  }, [selectedTime]);

  const handleHourChange = (h) => {
    if (Number.isInteger(h) && h >= 0 && h < 24) {
      setHour(h);
      handleTimeChange(h, minute);
    }
  };

  const handleMinuteChange = (m) => {
    if (Number.isInteger(m) && m >= 0 && m < 60) {
      setMinute(m);
      handleTimeChange(hour, m);
    }
  };

  const handleTimeChange = (h, m) => {
    const newDate = new Date();
    newDate.setHours(h);
    newDate.setMinutes(m);
    handleTimeSelect(newDate);
  };

  return (
    <>
      <div className="timePicker">
        <div className="timePicker-column">
          <table key={"hours-table"}>
            <tbody>
              {[...Array(24).keys()].map((h) => (
                <tr key={`${h}-hours-tr`}>
                  <td
                    key={h}
                    className={`hours-cell ${h === hour ? "selected-hours" : ""
                      }`}
                    onClick={() => handleHourChange(h)}
                  >
                    {h.toString().padStart(2, "0")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="timePicker-column">
          <table key={"minutes-table"}>
            <tbody>
              {[...Array(60).keys()].map((m) => (
                <tr key={`${m}-minutes-tr`}>
                  <td
                    key={m}
                    className={`minutes-cell ${m === minute ? "selected-minutes" : ""
                      }`}
                    onClick={() => handleMinuteChange(m)}
                  >
                    {m.toString().padStart(2, "0")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TimePicker;
