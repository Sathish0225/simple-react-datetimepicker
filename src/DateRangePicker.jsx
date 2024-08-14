import React, { useState, useRef, useEffect } from 'react';
import { FiChevronUp, FiChevronDown, FiCalendar } from "react-icons/fi";
import { format, parse } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

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

const DateRangePicker = (props) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [calendarShow, setCalendarShow] = useState(false);
    const [viewMode, setViewMode] = useState("days");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
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
        if (calendarShow && inputRef.current && calendarRef.current) {
            const inputRect = inputRef.current.getBoundingClientRect();
            // calendarRef.current.style.left = `${inputRect.left + window.scrollX}px`;
        }
    }, [calendarShow]);

    useEffect(() => {
        if (props.selected) {
            const { startDate, endDate } = props.selected;

            // parse and format the start date
            if (startDate) {
                const parsedStartDate = parse(startDate, dateFormat, new Date());
                if (!isNaN(parsedStartDate)) {
                    const formattedStartDate = format(parsedStartDate, dateFormat);
                    setStartDate(formattedStartDate);
                    setSelectedStartDate(parsedStartDate);
                }
            }

            // parse and format the end date
            if (endDate) {
                const parsedEndDate = parse(endDate, dateFormat, new Date());
                if (!isNaN(parsedEndDate)) {
                    const formattedEndDate = format(parsedEndDate, dateFormat);
                    setEndDate(formattedEndDate);
                    setSelectedEndDate(parsedEndDate);
                }
            }
        }
    }, [props.selected, dateFormat]);

    const handleDateSelect = (date) => {
        const formattedDate = format(date, dateFormat);

        if (isSelectingStartDate) {
            setStartDate(formattedDate);
            setSelectedStartDate(date);
            setIsSelectingStartDate(false);
        } else {
            setEndDate(formattedDate);
            setSelectedEndDate(date);
            setCalendarShow(false);
            setIsSelectingStartDate(true);

            // Trigger the onChange callback with updated start and end dates
            if (props.onChange) {
                props.onChange({
                    startDate: startDate ? startDate : formattedDate,
                    endDate: formattedDate
                });
            }
        }
    };

    const handleClear = () => {
        setStartDate("");
        setEndDate("");
        setSelectedStartDate("");
        setSelectedEndDate("");
        setCurrentDate(new Date());
        setViewMode("days");
        setCalendarShow(false);
        setIsSelectingStartDate(true);

        if (props.onChange) {
            props.onChange({ startDate: "", endDate: "" });
        }
    };

    const handleToday = () => {
        const today = new Date();
        const formattedToday = format(today, dateFormat);

        setStartDate(formattedToday);
        setSelectedStartDate(today);
        setEndDate(formattedToday);
        setSelectedEndDate(today);

        setCalendarShow(false);
        setIsSelectingStartDate(true);

        if (props.onChange) {
            props.onChange({
                startDate: formattedToday,
                endDate: formattedToday
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

    const getDateRangeText = () => {
        const startText = selectedStartDate ? format(selectedStartDate, dateFormat) : "";
        const endText = selectedEndDate ? format(selectedEndDate, dateFormat) : "";
        if (startText == "" && endText == "") {
            return "";
        }
        if (startText != null && endText == "") {
            return `${startText} - End Date`;
        }
        return `${startText} - ${endText}`;
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
                        value={getDateRangeText()}
                        readOnly
                        onClick={handleDateChange}
                        placeholder={props.placeholder ?? "Select Date Range"}
                    />
                    <span onClick={handleDateChange} className={"input-group-text i-sufix text-secondary"}>
                        <FiCalendar size={16} />
                    </span>
                </div>
                {calendarShow && (
                    <div ref={calendarRef} className={`calendar ${calendarShow ? "calendar-show" : ""}`}>
                        {viewMode === "days" && (
                            <DaysView
                                currentDate={currentDate}
                                setViewMode={setViewMode}
                                handleDateSelect={handleDateSelect}
                                changeMonth={changeMonth}
                                handleClear={handleClear}
                                handleToday={handleToday}
                                selectedStartDate={selectedStartDate}
                                selectedEndDate={selectedEndDate}
                                isSelectingStartDate={isSelectingStartDate}
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
    selectedStartDate,
    selectedEndDate,
    isSelectingStartDate,
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

    const daysArray = [
        ...Array(firstDayOfMonth).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const rows = [];
    for (let i = 0; i < daysArray.length; i += 7) {
        const rowDays = daysArray.slice(i, i + 7);
        rows.push(
            <tr key={i}>
                {rowDays.map((day, index) => (
                    <td
                        key={index}
                        className={getDayClass(day, currentDate, selectedStartDate, selectedEndDate,)}
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
        </>
    );
};

const getDayClass = (day, currentDate, selectedStartDate, selectedEndDate) => {
    if (!day) return "";

    const today = new Date();
    const currentFullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    const isToday =
        today.getFullYear() === currentFullDate.getFullYear() &&
        today.getMonth() === currentFullDate.getMonth() &&
        today.getDate() === currentFullDate.getDate();

    const isSelectedStart =
        selectedStartDate &&
        selectedStartDate.getFullYear() === currentFullDate.getFullYear() &&
        selectedStartDate.getMonth() === currentFullDate.getMonth() &&
        selectedStartDate.getDate() === currentFullDate.getDate();

    const isSelectedEnd =
        selectedEndDate &&
        selectedEndDate.getFullYear() === currentFullDate.getFullYear() &&
        selectedEndDate.getMonth() === currentFullDate.getMonth() &&
        selectedEndDate.getDate() === currentFullDate.getDate();

    const isInRange =
        selectedStartDate &&
        selectedEndDate &&
        currentFullDate > selectedStartDate &&
        currentFullDate < selectedEndDate;

    if (selectedStartDate && selectedEndDate &&
        selectedStartDate.getFullYear() === selectedEndDate.getFullYear() &&
        selectedStartDate.getFullYear() === currentFullDate.getFullYear() &&
        selectedStartDate.getMonth() === selectedEndDate.getMonth() &&
        selectedStartDate.getMonth() === currentFullDate.getMonth() &&
        selectedStartDate.getDate() === selectedEndDate.getDate() &&
        selectedStartDate.getDate() === day) {
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

export default DateRangePicker
