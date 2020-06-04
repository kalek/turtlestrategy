import React from "react";
import "./App.css";

import Papa from "papaparse";
import csvFile from "./dax.csv";
import { Chart } from "react-charts";

const App = () => {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (data === null) {
      Papa.parse(csvFile, {
        header: true,
        download: true,
        skipEmptyLines: true,

        complete: (result) => {
          const tmp = result.data.map((item) => [
            new Date(item.Date),
            parseFloat(item.Close),
          ]);
          console.log(tmp);
          const data = tmp.filter((item) => item[1]);
          const testData = data.map((item) => item[1]);
          const long = [];
          const short = [];
          const cash = [];
          testData.forEach((item, index) => {
            if (index >= 10) {
              const current = testData[index];
              const last5 = testData.slice(index - 5, index);
              const last10 = testData.slice(index - 10, index);
              const maxLast5 = Math.max.apply(Math, last5);
              const maxLast10 = Math.max.apply(Math, last10);
              const minLast5 = Math.min.apply(Math, last5);
              const minLast10 = Math.min.apply(Math, last10);
              if (current < minLast10 && !short.length) {
                short.push(current);
                console.log(index, current, "SHORT");
              } else if (current > maxLast5 && short.length) {
                cash.push({
                  current,
                  short: short[0],
                  value: short[0] - current,
                });
                short.pop();
              }
              if (current > maxLast10 && !long.length) {
                long.push(current);
                console.log(index, current, "LONG");
              } else if (current < minLast5 && long.length) {
                cash.push({
                  current,
                  long: long[0],
                  value: current - long[0],
                  indexClose: index,
                });
                long.pop();
              }
            }
          });
          const values = cash.map((item) => item.value);
          const getSum = (total, num) => total + num;
          const points = values.reduce(getSum, 0);
          console.log(cash);
          console.log(points);

          setData([
            {
              label: "Coffee",
              data: data,
            },
          ]);
        },
      });
    }
  }, [data]);

  const axes = React.useMemo(
    () => [
      { primary: true, type: "time", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );
  return (
    <div
      style={{
        width: "100%",
        height: "600px",
      }}
    >
      {data ? <Chart data={data} axes={axes} /> : null}
      react-timeseries-charts
    </div>
  );
};

export default App;
