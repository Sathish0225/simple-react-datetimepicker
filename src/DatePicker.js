/* eslint-disable no-loop-func */
import React, { useState, useRef, useEffect } from "react";
import { CiCalendar } from "react-icons/ci";
import { format, parse } from "date-fns";
import "./DatePicker.css";

// Define valid date formats
const VALID_DATE_FORMATS = [
  "dd/MM/yyyy",
  "MM/dd/yyyy",
  "yyyy-MM-dd",
  "EEEE, MMMM d, yyyy",
  "EEE, MMM d, yyyy",
  "d MMMM yyyy",
  "M/d/yy",
  "M/d/yyyy",
];

// Utility function to validate date format
const isValidDateFormat = (formatString) => {
  return VALID_DATE_FORMATS.includes(formatString);
};

const DatePicker = (props) => {
  const [datePicked, setDatePicked] = useState("");
  const [calendarShow, setCalendarShow] = useState(false);
  const [viewMode, setViewMode] = useState("days");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const inputRef = useRef(null);
  const calendarRef = useRef(null);

  const dateFormat = isValidDateFormat(props.dateformat)
    ? props.dateformat
    : "dd/MM/yyyy";

  const handleDateChange = () => {
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
    if (calendarShow) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const calendarElement = calendarRef.current;
      calendarElement.style.left = `${inputRect.left + window.scrollX}px`;
    }
  }, [calendarShow]);

  useEffect(() => {
    if (props.selected) {
      const parsedDate = parse(props.selected, dateFormat, new Date());
      if (!isNaN(parsedDate)) {
        const formattedDate = format(parsedDate, dateFormat);
        setDatePicked(formattedDate);
        setSelectedDate(parsedDate);
      }
    }
  }, [props.selected, dateFormat]);

  const handleDateSelect = (date) => {
    const formattedDate = format(date, dateFormat);
    setDatePicked(formattedDate);
    setSelectedDate(date);
    setCalendarShow(false);

    if (props.onChange) {
      props.onChange(formattedDate);
    }
  };

  const handleClear = () => {
    setDatePicked("");
    setSelectedDate("");
    setCurrentDate(new Date());
    setViewMode("days");
    setCalendarShow(false);

    if (props.onChange) {
      props.onChange("");
    }
  };

  const handleToday = () => {
    const today = new Date();
    handleDateSelect(today);
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
      <div className="date-picker">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            name={props.name}
            id={props.id}
            value={datePicked}
            readOnly
            onClick={handleDateChange}
            placeholder={props.placeholder ?? "Select Date"}
          />
          <span onClick={handleDateChange}>
            <CiCalendar />
          </span>
        </div>
        {calendarShow && (
          <div ref={calendarRef} className="calendar">
            {viewMode === "days" && (
              <DaysView
                currentDate={currentDate}
                setViewMode={setViewMode}
                handleDateSelect={handleDateSelect}
                changeMonth={changeMonth}
                handleClear={handleClear}
                handleToday={handleToday}
                selectedDate={selectedDate}
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
}) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
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
      <Header
        title={`${
          monthNames[currentDate.getMonth()]
        } ${currentDate.getFullYear()}`}
        onPrevious={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
        onTitleClick={() => setViewMode("months")}
      />
      <table>
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
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
    </>
  );
};

const getDayClass = (day, currentDate, selectedDate) => {
  if (!day) return "";
  const today = new Date();
  const isToday =
    today.getFullYear() === currentDate.getFullYear() &&
    today.getMonth() === currentDate.getMonth() &&
    today.getDate() === day;

  const isSelected =
    selectedDate &&
    selectedDate.getFullYear() === currentDate.getFullYear() &&
    selectedDate.getMonth() === currentDate.getMonth() &&
    selectedDate.getDate() === day;

  if (isSelected) return "date-selected";
  if (isToday) return "today";

  return "";
};

const Header = ({ title, onPrevious, onNext, onTitleClick }) => (
  <div className="ymheaderdiv">
    <button onClick={onPrevious} className="previous-button">
      {"<"}
    </button>
    <h3 onClick={onTitleClick}>{title}</h3>
    <button onClick={onNext} className="next-button">
      {">"}
    </button>
  </div>
);

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
            className={`month-cell ${
              currentYear === new Date().getFullYear() &&
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
            className={`year-cell ${
              year === new Date().getFullYear() ? "year-today" : ""
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

export default DatePicker;
