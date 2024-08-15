/* eslint-disable no-loop-func */
import React, { useState, useRef, useEffect } from "react";
import { FiChevronUp, FiChevronDown, FiCalendar } from "react-icons/fi";
import { format, parse } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

// Define valid datetime formats
const VALID_DATE_TIME_FORMATS = [
  "dd/MM/yyyy hh:mm a",
  "dd/MM/yyyy hh:mm:ss a",
  "dd/MM/yyyy HH:mm",
  "dd/MM/yyyy HH:mm:ss",
  "MM/dd/yyyy hh:mm a",
  "MM/dd/yyyy hh:mm:ss a",
  "yyyy-MM-dd'T'HH:mm:ss",
  "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  "yyyy-MM-dd HH:mm",
  "yyyy-MM-dd HH:mm:ss",
  "EEEE, MMMM d, yyyy h:mm a",
  "EEE, MMM d, yyyy h:mm a",
  "EEEE, MMMM d, yyyy hh:mm a",
  "EEE, MMM d, yyyy hh:mm a",
  "EEEE, MMMM d, yyyy HH:mm",
  "EEE, MMM d, yyyy HH:mm",
  "d MMMM yyyy HH:mm:ss",
  "M/d/yy h:mm a",
  "M/d/yyyy h:mm:ss a",
];

// Utility function to validate datetime format
const isValidDateTimeFormat = (formatString) => {
  return VALID_DATE_TIME_FORMATS.includes(formatString);
};

const DateTimePicker = (props) => {
  const [dateTime, setDateTime] = useState("");
  const [calendarShow, setCalendarShow] = useState(false);
  const [viewMode, setViewMode] = useState("days");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const inputRef = useRef(null);
  const calendarRef = useRef(null);

  const dateTimeFormat = isValidDateTimeFormat(props.dateTimeformat)
    ? props.dateTimeformat
    : "dd/MM/yyyy HH:mm:ss";

  const handleDateTimeChange = () => {
    setCalendarShow(true);
    setViewMode("days");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setCalendarShow(false);
      }
    };

    if (calendarShow) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarShow]);

  useEffect(() => {
    if (calendarShow && inputRef.current && calendarRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      // calendarRef.current.style.left = `${inputRect.left + window.scrollX}px`;
    }
  }, [calendarShow]);

  useEffect(() => {
    if (props.selected) {
      const parsedDateTime = parse(props.selected, dateTimeFormat, new Date());
      if (!isNaN(parsedDateTime)) {
        const formattedDateTime = format(parsedDateTime, dateTimeFormat);
        setDateTime(formattedDateTime);
        setSelectedDate(parsedDateTime);
        setSelectedTime(parsedDateTime);
      }
    }
  }, [props.selected, dateTimeFormat]);

  const handleDateTimeSelect = (date) => {
    const newDate = new Date(date);
    const formattedDateTime = format(newDate, dateTimeFormat);
    setDateTime(formattedDateTime);
    setSelectedDate(newDate);
    setSelectedTime(newDate);

    if (props.onChange) {
      props.onChange(formattedDateTime);
    }
  };

  const handleTimeSelect = (time) => {
    const newDate = new Date(time);
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());
    newDate.setSeconds(time.getSeconds());
    handleDateTimeSelect(newDate);
  };

  const handleClear = () => {
    setDateTime("");
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setViewMode("days");
    setCurrentDate(new Date());
    setCalendarShow(false);

    if (props.onChange) {
      props.onChange("");
    }
  };

  const handleToday = () => {
    const today = new Date();
    handleDateTimeSelect(today);
    setCalendarShow(false);
  };

  const changeMonth = (increment) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const changeYear = (increment) => {
    setCurrentDate((prevYear) => {
      const newDate = new Date(prevYear);
      newDate.setFullYear(newDate.getFullYear() + increment);
      return newDate;
    });
  };

  const changeDecade = (increment) => {
    setCurrentDate((prevDecade) => {
      const newDate = new Date(prevDecade);
      newDate.setFullYear(newDate.getFullYear() + 10 * increment);
      return newDate;
    });
  };

  return (
    <>
      <div className="date-time-picker">
        <div className="picker-input-group">
          <input
            ref={inputRef}
            type="text"
            name={props.name}
            id={props.id}
            className={props.className ?? "picker-input-field picker-r-input picker-c-input"}
            value={dateTime}
            readOnly
            onClick={handleDateTimeChange}
            placeholder={props.placeholder ?? "Select DateTime"}
          />
          <span onClick={handleDateTimeChange} className={"input-group-text picker-i-sufix text-secondary"}>
            <FiCalendar size={16} />
          </span>
        </div>
        {calendarShow && (
          <div ref={calendarRef} className={`calendar ${calendarShow ? "calendar-show" : ""}`}>
            {viewMode === "days" && (
              <DaysView
                currentDate={currentDate}
                setViewMode={setViewMode}
                handleDateSelect={handleDateTimeSelect}
                changeMonth={changeMonth}
                handleClear={handleClear}
                handleToday={handleToday}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                handleTimeSelect={handleTimeSelect}
              />
            )}
            {viewMode === "months" && (
              <MonthsView
                currentDate={currentDate}
                currentYear={currentDate.getFullYear()}
                setCurrentDate={setCurrentDate}
                setViewMode={setViewMode}
                changeYear={changeYear}
              />
            )}
            {viewMode === "years" && (
              <YearsView
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                setViewMode={setViewMode}
                changeDecade={changeDecade}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

const DaysView = ({
  currentDate,
  setViewMode,
  handleDateSelect,
  changeMonth,
  handleClear,
  handleToday,
  selectedDate,
  selectedTime,
  handleTimeSelect,
}) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Janary",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Create an array with empty cells for the days before the first day of the month
  const daysArray = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Break the daysArray into chunks of 7 to create rows
  const rows = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    const rowDays = daysArray.slice(i, i + 7);
    rows.push(
      <tr key={i}>
        {rowDays.map((day, index) => (
          <td
            key={index}
            className={getDayClass(day, currentDate, selectedDate)}
            onClick={() =>
              day &&
              handleDateSelect(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day,
                  currentDate.getHours(),
                  currentDate.getMinutes(),
                  currentDate.getSeconds()
                )
              )
            }
          >
            {day || ""}
          </td>
        ))}
      </tr>
    );
  }

  return (
    <>
      <div className="date-time-picker-container">
        <div className="datePicker">
          <Header
            title={`${monthNames[currentDate.getMonth()]
              } ${currentDate.getFullYear()}`}
            onPrevious={() => changeMonth(-1)}
            onNext={() => changeMonth(1)}
            onTitleClick={() => setViewMode("months")}
          />
          <table>
            <thead>
              <tr>
                {daysOfWeek.map((day) => (
                  <th key={day} className="week-days">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
          <div className="buttons">
            <button onClick={handleClear} className="clear-button">
              Clear
            </button>
            <button onClick={handleToday} className="today-button">
              Today
            </button>
          </div>
        </div>
        <TimeView
          selectedTime={selectedTime}
          handleTimeSelect={handleTimeSelect}
        />
      </div>
    </>
  );
};

const getDayClass = (day, currentDate, selectedDate) => {
  if (!day) return "";
  const today = new Date();
  const isToday =
    currentDate &&
    today.getFullYear() === currentDate.getFullYear() &&
    today.getMonth() === currentDate.getMonth() &&
    today.getDate() === day;

  const isSelected =
    selectedDate &&
    selectedDate.getFullYear() === currentDate.getFullYear() &&
    selectedDate.getMonth() === currentDate.getMonth() &&
    selectedDate.getDate() === day;

  if (isSelected) return "date-cell date-selected";
  if (isToday) return "date-cell today";

  return "date-cell";
};

const Header = ({ title, onPrevious, onNext, onTitleClick }) => (
  <div className="ymheaderdiv">
    <h3 onClick={onTitleClick}>{title}</h3>
    <div>
      <button onClick={onPrevious} className="previous-button">
        <FiChevronUp size={20} />
      </button>
      <button onClick={onNext} className="next-button">
        <FiChevronDown size={20} />
      </button>
    </div>
  </div>
);

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
    <div className="timePicker">
      <div className="timePicker-column">
        <table key={"hours-table"}>
          <tbody>
            {[...Array(24).keys()].map((h) => (
              <tr key={`${h}-hours-tr`}>
                <td
                  key={h}
                  className={`hours-cell ${h === hour ? "selected-hours" : ""}`}
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
  );
};

const MonthsView = ({
  currentDate,
  currentYear,
  setCurrentDate,
  setViewMode,
  changeYear,
}) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <>
      <Header
        title={`${currentDate.getFullYear()}`}
        onPrevious={() => changeYear(-1)}
        onNext={() => changeYear(1)}
        onTitleClick={() => setViewMode("years")}
      />
      <div className="month-grid">
        {monthNames.map((month, index) => (
          <div
            key={index}
            className={`month-cell ${currentYear === new Date().getFullYear() &&
              index === new Date().getMonth()
              ? "month-today"
              : ""
              }`}
            onClick={() => {
              const newDate = new Date(currentDate.setMonth(index));
              setCurrentDate(new Date(newDate));
              setViewMode("days");
            }}
          >
            {month}
          </div>
        ))}
      </div>
    </>
  );
};

const YearsView = ({
  currentDate,
  setCurrentDate,
  setViewMode,
  changeDecade,
}) => {
  const startYear =
    currentDate.getFullYear() - (currentDate.getFullYear() % 10);
  const years = Array.from({ length: 10 }, (_, i) => startYear + i);

  return (
    <>
      <Header
        title={`${startYear} - ${startYear + 9}`}
        onPrevious={() => changeDecade(-1)}
        onNext={() => changeDecade(1)}
      />
      <div className="year-grid">
        {years.map((year) => (
          <div
            key={year}
            className={`year-cell ${year === new Date().getFullYear() ? "year-today" : ""
              }`}
            onClick={() => {
              const newDate = new Date(currentDate.setFullYear(year));
              setCurrentDate(new Date(newDate));
              setViewMode("months");
            }}
          >
            {year}
          </div>
        ))}
      </div>
    </>
  );
};

export default DateTimePicker;
