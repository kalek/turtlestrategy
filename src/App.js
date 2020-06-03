import React from "react";
import "./App.css";

import Papa from "papaparse";
import csvFile from "./coffee.csv";
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
          const data = tmp.filter((item) => item[1]);
          const testData = data.map((item) => item[1]);
          const buy = [];
          const cash = [];
          testData.forEach((item, index) => {
            if (index >= 20) {
              const last10 = testData.slice(index - 10, index);
              const last20 = testData.slice(index - 20, index);
              const current = testData[index];
              const maxLast10 = Math.max.apply(Math, last10);
              const maxLast20 = Math.max.apply(Math, last20);
              if (current > maxLast20 && !buy.length) {
                buy.push(current);
              } else if (current < maxLast10 && buy.length) {
                cash.push({
                  current,
                  buy: buy[0],
                  value: current - buy[0],
                });
                buy.pop();
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
