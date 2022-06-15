## Prerequisites

Node.js v14 or newer

## Installation

```
npm i optivum-timetable-parser
```

## Usage

```js
import { Table } from "optivum-timetable-parser";

const t = new Table(/* Optivum-generated timetable .htm file */);

// gets lessons ordered by day and accordingly splitted into groups
const lessonsOrderedByDay = t.days;

// gets day names from the table
const days = t.dayNames;

// gets lesson-hours
const hours = t.hours;

// gets title from the header
const name = t.name;
```
