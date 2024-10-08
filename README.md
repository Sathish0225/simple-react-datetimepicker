# DateTime Picker For React

A simple and reusable Datepicker component for React

!["Picker-20240808123749.png"](https://raw.githubusercontent.com/Sathish0225/simple-react-datetimepicker/main/ReadMe.assets/Picker-20240808123749.png)

## Installation

The package can be installed via [npm](https://github.com/npm/cli):

```bash
npm install simple-react-datetimepicker
```

Or via [yarn](https://github.com/yarnpkg/yarn):

 ```bash
yarn add simple-react-datetimepicker
 ```

You’ll need to install React and PropTypes separately since those dependencies aren’t included in the package. If you need to use a locale other than the default en-US, you'll also need to import that into your project from date-fns (see Localization section below). Below is a simple example of how to use the Datepicker in a React view. You will also need to require the CSS file from this package (or provide your own). The example below shows how to include the CSS from this package if your build system supports requiring CSS files (Webpack is one that does).

```js
import React, { useState } from "react";
import DatePicker from "simple-react-datetimepicker";

const Example = () => {
  const [startDate, setStartDate] = useState("");
  return (
    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateformat="dd/MM/yyyy" />
  );
};
```

```js
import React, { useState } from "react";
import DateTimePicker from "simple-react-datetimepicker";

const Example = () => {
  const [startDateTime, setStartDateTime] = useState("");
  return (
    <DateTimePicker selected={startDateTime} onChange={(dateTime) => setStartDateTime(dateTime)} dateTimeformat="dd/MM/yyyy HH:mm:ss" />
  );
};
```

```js
import React, { useState } from "react";
import TimePicker from "simple-react-datetimepicker";

const Example = () => {
  const [startTime, setStartTime] = useState("");
  return (
    <TimePicker selected={startTime} onChange={(time) => setStartTime(time)} timeformat="HH:mm:ss" />
  );
};
```

```js
import React, { useState } from "react";
import DateRangePicker from "simple-react-datetimepicker";

const Example = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  return (
    <DateRangePicker selected={{startDate,endDate}} 
      onChange={({ startDate, endDate }) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }} dateformat="dd/MM/yyyy" />
  );
};
```

```js
import React, { useState } from "react";
import DateTimeRangePicker from "simple-react-datetimepicker";

const Example = () => {
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  return (
    <DateTimeRangePicker selected={{ startDateTime, endDateTime }}
            onChange={({ startDateTime, endDateTime }) => {
              setStartDateTime(startDateTime);
              setEndDateTime(endDateTime);
            }} dateTimeformat="dd/MM/yyyy HH:mm:ss" />
  );
};
```

## Configuration

The most basic use of the DatePicker, DateTimePicker and TimePicker can be described with:

### Date Picker

```js
<DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
```

### DateTime picker

```js
<DateTimePicker selected={startDateTime} onChange={(dateTime) => setStartDateTime(dateTime)}/>
```

### Time picker

```js
<TimePicker selected={startTime} onChange={(time) => setStartTime(time)}/>
```

### Date Range Picker

```js
<DateRangePicker selected={{startDate,endDate}} onChange={({ startDate, endDate }) => {setStartDate(startDate);setEndDate(endDate);}}/>
```

### DateTime Range Picker

```js
<DateTimeRangePicker selected={{startDateTime,endDateTime}} onChange={({ startDateTime, endDateTime }) => {setStartDateTime(startDateTime);setEndDateTime(endDateTime);}}/>
```

## License

Copyright (c) 2024 individual contributors. Licensed under MIT license, see [LICENSE](LICENSE) for the full license.
