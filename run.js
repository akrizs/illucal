const FS = require("fs").promises;

const csv_headers = [
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D9",
  "D10",
  "D11",
  "D12",
  "D13",
  "D14",
  "D15",
  "D16",
  "D17",
  "D18",
  "D19",
  "D20",
  "D21",
  "D22",
  "D23",
  "D24",
  "D25",
  "D26",
  "D27",
  "D28",
  "D29",
  "D30",
  "D31",
  "D32",
  "D33",
  "D34",
  "D35",
  "D36",
  "D37",
  "D38",
  "D39",
  "D40",
  "D41",
  "D42",
  "#D1Vis",
  "#D2Vis",
  "#D3Vis",
  "#D4Vis",
  "#D5Vis",
  "#D6Vis",
  "#D29Vis",
  "#D30Vis",
  "#D31Vis",
  "#D32Vis",
  "#D33Vis",
  "#D34Vis",
  "#D35Vis",
  "#D36Vis",
  "#D37Vis",
  "#D38Vis",
  "#D39Vis",
  "#D40Vis",
  "#D41Vis",
  "#D42Vis",
  "WD7",
  "WD6",
  "WD5",
  "WD4",
  "WD3",
  "WD2",
  "WD1",
  "W1",
  "W2",
  "W3",
  "W4",
  "W5",
  "W6",
  "#WeekNoHeader",
  "#WeekDaysHeader",
  "WeekNoAbbr",
  "#W6Vis",
  "#W5Vis",
  "#W4Vis",
  "Year",
  "Month",
  "#InfoVis",
];

async function start(
  {
    firstDayOfWeek = "mon",
    displayWeekNo = true,
    displayWeekdaysHeader = true,
    displayWeekNoHeader = true,
    weekNoAbbr = "w",
    displayInfo = true,
  } = {},
  ...yrs
) {
  if (yrs.some(e => Array.isArray(e))) {
    yrs = yrs.flat();
  }
  yrs = yrs.map(y => {
    if (typeof y === "string") {
      return parseInt(y);
    } else if (typeof y === "number") {
      return y;
    } else {
      throw new Error(
        "generateYearInfo only accepts string[] or number[]",
      );
    }
  });
  firstDayOfWeek =
    firstDayOfWeek.toLowerCase() === "mon" ||
    firstDayOfWeek.toLowerCase() === "sun"
      ? firstDayOfWeek
      : "mon";

  const yearsGenerated = generateYearInfo(
    { firstDayOfWeek },
    yrs,
  );
  // csv_headers;
  const regenYears = yearsGenerated.years.map(y => {
    let csvMonths = y.months.map(m => {
      let ph = Array(csv_headers.length).fill("");
      let firstDay = m.firstDay;
      let daysIn = m.daysIn;
      let lastDay = m.firstDay + m.firstDay;

      for (let i = 0; i < m.firstDay; i++) {
        ph[csv_headers.indexOf(`D${i}`)] = "";
        ph[csv_headers.indexOf(`#D${i}Vis`)] = "false";
      }

      for (let i = 1; i <= daysIn; i++) {
        if (firstDay <= 6) {
          ph[csv_headers.indexOf(`#D${firstDay}Vis`)] =
            "true";
        }

        ph[csv_headers.indexOf(`D${firstDay}`)] = String(i);

        if (firstDay >= 29) {
          ph[csv_headers.indexOf(`#D${firstDay}Vis`)] =
            "true";
        }

        firstDay++;
      }

      for (let i = m.firstDay + m.daysIn; i <= 42; i++) {
        ph[csv_headers.indexOf(`D${i}`)] = "";
        ph[csv_headers.indexOf(`#D${i}Vis`)] = "false";
      }

      ph[csv_headers.indexOf("#WeekNoHeader")] = String(
        displayWeekNoHeader,
      );
      ph[csv_headers.indexOf("#WeekDaysHeader")] = String(
        displayWeekdaysHeader,
      );
      ph[csv_headers.indexOf("#InfoVis")] = String(
        displayInfo,
      );
      ph[csv_headers.indexOf("Year")] = String(y.year);
      ph[csv_headers.indexOf("Month")] = m.name;
      ph[csv_headers.indexOf("WeekNoAbbr")] = weekNoAbbr;

      for (
        let i = 0;
        i < yearsGenerated.weekdaysAbbr.length;
        i++
      ) {
        ph[csv_headers.indexOf(`WD${i + 1}`)] =
          yearsGenerated.weekdaysAbbr[i];
      }

      for (let i = 1; i <= m.weeks.length; i++) {
        ph[csv_headers.indexOf(`W${i}`)] = String(
          m.weeks[i - 1],
        );
        if (i >= 4) {
          ph[csv_headers.indexOf(`#W${i}Vis`)] = "true";
        }
      }

      for (let i = 7; m.weeks.length + 1 <= i; i--) {
        ph[csv_headers.indexOf(`W${i}`)] = "";
        ph[csv_headers.indexOf(`#W${i}Vis`)] = "false";
      }

      return ph;
    });

    csvMonths.unshift(csv_headers);

    csvMonths = csvMonths.map((d, i) => {
      if (i !== 0) {
      }
      return `${d.join(",")}\n`;
    });

    FS.writeFile(
      `output/${y.year}.csv`,
      csvMonths.join(""),
    );
  });
}

Date.prototype.getWeek = function () {
  let date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(
    date.getDate() + 3 - ((date.getDay() + 6) % 7),
  );
  // January 4 is always in week 1.
  let week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
};

Date.prototype.getWeekYear = function () {
  let date = new Date(this.getTime());
  date.setDate(
    date.getDate() + 3 - ((date.getDay() + 6) % 7),
  );
  return date.getFullYear();
};

const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const weekdaysAbbr = ["m", "t", "w", "t", "f", "s"];

const monthsFull = [
  "january",
  "jebruary",
  "mars",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const monthsAbbr = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function generateYearInfo(
  { firstDayOfWeek = "mon" } = {},
  ...yrs
) {
  if (yrs.some(e => Array.isArray(e))) {
    yrs = yrs.flat();
  }
  yrs = yrs.map(y => {
    if (typeof y === "string") {
      return parseInt(y);
    } else if (typeof y === "number") {
      return y;
    } else {
      throw new Error(
        "generateYearInfo only accepts string[] or number[]",
      );
    }
  });

  if (firstDayOfWeek === "mon") {
    weekdaysAbbr.push("s");
    weekdays.push("sunday");
  } else {
    weekdaysAbbr.unshift("s");
    weekdays.unshift("sunday");
  }

  yrs = yrs.map((n, k) => {
    y = {};
    y.year = n;
    y.months = monthsAbbr.map((m, i) => {
      let firstDay = new Date(n, i);
      let daysIn = 32 - new Date(n, i, 32).getDate();
      let lastDay = new Date(n, i, daysIn);
      let firstDayInWeek = firstDay.getDay();
      let firstWeek = firstDay.getWeek();
      let lastWeek = lastDay.getWeek();
      if (
        firstDayOfWeek.toLowerCase() === "mon" &&
        firstDayInWeek === 0
      ) {
        firstDayInWeek = 7;
      }
      let weeks = [];
      if (i === 0 && firstWeek !== 1) {
        weeks.push(firstWeek);
        let k = 1;
        for (let w = lastWeek; w >= 1; w--) {
          weeks.push(k++);
        }
      } else if (i === 11 && lastWeek === 1) {
        for (
          let i = firstWeek;
          i <= new Date(lastDay - 604800000).getWeek();
          i++
        ) {
          weeks.push(i);
        }
        weeks.push(lastWeek);
      } else {
        for (let w = firstWeek; w <= lastWeek; w++) {
          weeks.push(w);
        }
      }
      return {
        name: monthsFull[i],
        abbr: m,
        firstDay: firstDayInWeek,
        daysIn: daysIn,
        weeks: weeks,
      };
    });

    y.totalDays = y.months
      .map(m => m.daysIn)
      .reduce((acc, c) => {
        return acc + c;
      }, 0);

    y.yearsFirstWeek = new Date(n - 1, 11, 32).getWeek();
    y.yearsLastWeek = new Date(n + 1, 0, 1).getWeek();

    y.isLeapYear = y.totalDays === 366 ? true : false;

    y.totalWeeks = y.totalDays / 7;
    return y;
  });
  return {
    years: yrs,
    weekdays,
    weekdaysAbbr,
  };
}

start(
  {
    firstDayOfWeek: "mon",
    displayWeekNo: true,
    displayWeekdaysHeader: true,
    displayWeekNoHeader: true,
    weekNoAbbr: "w",
    displayInfo: false,
  },
  1944,
  1945,
  1946,
  1947,
  1948,
);
