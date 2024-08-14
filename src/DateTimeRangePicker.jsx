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

const DateTimeRangePicker = (props) => {
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [calendarShow, setCalendarShow] = useState(false);
    const [viewMode, setViewMode] = useState("days");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDateTime, setSelectedStartDateTime] = useState("");
    const [selectedEndDateTime, setSelectedEndDateTime] = useState("");
    const [isSelectingStartDateTime, setIsSelectingStartDateTime] = useState(true);
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
            const { startDateTime, endDateTime } = props.selected;

            // parse and format the start date
            if (startDateTime) {
                const parsedStartDateTime = parse(startDateTime, dateTimeFormat, new Date());
                if (!isNaN(parsedStartDateTime)) {
                    const formattedStartDateTime = format(parsedStartDateTime, dateTimeFormat);
                    setStartDateTime(formattedStartDateTime);
                    setSelectedStartDateTime(parsedStartDateTime);
                }
            }

            // parse and format the end date
            if (endDateTime) {
                const parsedEndDateTime = parse(endDateTime, dateTimeFormat, new Date());
                if (!isNaN(parsedEndDateTime)) {
                    const formattedEndDateTime = format(parsedEndDateTime, dateTimeFormat);
                    setEndDateTime(formattedEndDateTime);
                    setSelectedEndDateTime(parsedEndDateTime);
                }
            }
        }
    }, [props.selected, dateTimeFormat]);

    const handleDateTimeSelect = (datetime) => {
        let formattedDateTime = format(datetime, dateTimeFormat);

        if (isSelectingStartDateTime) {
            // Set start datetime to the start of the day
            const startDateTimeCopy = new Date(datetime.getTime());
            startDateTimeCopy.setHours(0);
            startDateTimeCopy.setMinutes(0);
            startDateTimeCopy.setSeconds(0);

            formattedDateTime = format(startDateTimeCopy, dateTimeFormat);
            setStartDateTime(formattedDateTime);
            setSelectedStartDateTime(startDateTimeCopy);
            setIsSelectingStartDateTime(false);
        } else {
            // Set end datetime to the end of the day
            const endDateTimeCopy = new Date(datetime.getTime());
            endDateTimeCopy.setHours(23);
            endDateTimeCopy.setMinutes(59);
            endDateTimeCopy.setSeconds(59);

            formattedDateTime = format(endDateTimeCopy, dateTimeFormat);
            setEndDateTime(formattedDateTime);
            setSelectedEndDateTime(endDateTimeCopy);
            setCalendarShow(false);
            setIsSelectingStartDateTime(true);
        }

        // Use the updated datetime values for the callback
        const updatedStartDateTime = isSelectingStartDateTime ? formattedDateTime : startDateTime;
        const updatedEndDateTime = !isSelectingStartDateTime ? formattedDateTime : endDateTime;

        // Trigger the onChange callback with updated start and end datetimes
        if (props.onChange) {
            props.onChange({
                startDateTime: updatedStartDateTime,
                endDateTime: updatedEndDateTime
            });
        }
    };


    const handleClear = () => {
        setStartDateTime("");
        setEndDateTime("");
        setSelectedStartDateTime("");
        setSelectedEndDateTime("");
        setCurrentDate(new Date());
        setViewMode("days");
        setCalendarShow(false);
        setIsSelectingStartDateTime(true);

        if (props.onChange) {
            props.onChange({ startDateTime: "", endDateTime: "" });
        }
    };

    const handleToday = () => {
        const startDate = new Date();
        const endDate = new Date();

        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        const formattedStartDate = format(startDate, dateTimeFormat);
        const formattedEndDate = format(endDate, dateTimeFormat);

        setStartDateTime(formattedStartDate);
        setSelectedStartDateTime(startDate);
        setEndDateTime(formattedEndDate);
        setSelectedEndDateTime(endDate);

        setCalendarShow(false);
        setIsSelectingStartDateTime(true);

        if (props.onChange) {
            props.onChange({
                startDateTime: formattedStartDate,
                endDateTime: formattedEndDate
            });
        }
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

    const getDateTimeRangeText = () => {
        const startText = selectedStartDateTime ? format(selectedStartDateTime, dateTimeFormat) : "";
        const endText = selectedEndDateTime ? format(selectedEndDateTime, dateTimeFormat) : "";
        if (startText == "" && endText == "") {
            return "";
        }
        if (startText != null && endText == "") {
            return `${startText} - End DateTime`;
        }
        return `${startText} - ${endText}`;
    };

    const handleCustomFieldChange = (event) => {
        const { name, value } = event.target;
        if (name === "startDateTime") {
            const parsedStartDateTime = parse(value, dateTimeFormat, new Date());
            if (!isNaN(parsedStartDateTime)) {
                const formattedStartDateTime = format(parsedStartDateTime, dateTimeFormat);
                setStartDateTime(formattedStartDateTime);
                setSelectedStartDateTime(parsedStartDateTime);
            }
        } else if (name === "endDateTime") {
            const parsedEndDateTime = parse(value, dateTimeFormat, new Date());
            if (!isNaN(parsedEndDateTime)) {
                const formattedEndDateTime = format(parsedEndDateTime, dateTimeFormat);
                setEndDateTime(formattedEndDateTime);
                setSelectedEndDateTime(parsedEndDateTime);
            }
        }
    };

    return (
        <>
            <div className="date-picker">
                <div className="input-group">
                    <input
                        ref={inputRef}
                        type="text"
                        name={props.name}
                        id={props.id}
                        className={props.className ?? "form-control r-input c-input"}
                        value={getDateTimeRangeText()}
                        readOnly
                        onClick={handleDateTimeChange}
                        placeholder={props.placeholder ?? "Select DateTime Range"}
                    />
                    <span onClick={handleDateTimeChange} className={"input-group-text i-sufix text-secondary"}>
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
                                startDateTime={startDateTime}
                                endDateTime={endDateTime}
                                selectedStartDateTime={selectedStartDateTime}
                                selectedEndDateTime={selectedEndDateTime}
                                handleCustomFieldChange={handleCustomFieldChange}
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
    startDateTime,
    endDateTime,
    selectedStartDateTime,
    selectedEndDateTime,
    handleCustomFieldChange,
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
                        className={getDayClass(day, currentDate, selectedStartDateTime, selectedEndDateTime)}
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
                <div className="custom-input-box">
                    <input
                        type="text"
                        className="custom-input"
                        name="startDateTime"
                        value={startDateTime}
                        onChange={handleCustomFieldChange}
                    />
                    <span style={{ padding: "5px" }}>-</span>
                    <input
                        type="text"
                        className="custom-input"
                        name="endDateTime"
                        value={endDateTime}
                        onChange={handleCustomFieldChange}
                    />
                </div>
            </div>
        </>
    );
};

const getDayClass = (day, currentDate, selectedStartDateTime, selectedEndDateTime) => {
    if (!day) return "";

    const today = new Date();
    const currentFullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    const isToday =
        today.getFullYear() === currentFullDate.getFullYear() &&
        today.getMonth() === currentFullDate.getMonth() &&
        today.getDate() === currentFullDate.getDate();

    const isSelectedStart =
        selectedStartDateTime &&
        selectedStartDateTime.getFullYear() === currentFullDate.getFullYear() &&
        selectedStartDateTime.getMonth() === currentFullDate.getMonth() &&
        selectedStartDateTime.getDate() === currentFullDate.getDate();

    const isSelectedEnd =
        selectedEndDateTime &&
        selectedEndDateTime.getFullYear() === currentFullDate.getFullYear() &&
        selectedEndDateTime.getMonth() === currentFullDate.getMonth() &&
        selectedEndDateTime.getDate() === currentFullDate.getDate();

    const isInRange =
        selectedStartDateTime &&
        selectedEndDateTime &&
        currentFullDate > selectedStartDateTime &&
        currentFullDate < selectedEndDateTime;

    if (selectedStartDateTime && selectedEndDateTime &&
        selectedStartDateTime.getFullYear() === selectedEndDateTime.getFullYear() &&
        selectedStartDateTime.getFullYear() === currentFullDate.getFullYear() &&
        selectedStartDateTime.getMonth() === selectedEndDateTime.getMonth() &&
        selectedStartDateTime.getMonth() === currentFullDate.getMonth() &&
        selectedStartDateTime.getDate() === selectedEndDateTime.getDate() &&
        selectedStartDateTime.getDate() === day) {
        return "date-cell date-selected-startend";
    }

    if (isSelectedStart) return "date-cell date-selected-start";
    if (isSelectedEnd) return "date-cell date-selected-end";
    if (isInRange) return "date-cell date-in-range";
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

export default DateTimeRangePicker;
