import React, { PureComponent } from 'react';
import {
  PieChart, Pie
} from 'recharts';

const data02 = [
  { name: 'A1', value: 25 },
  { name: 'A2', value: 75 },
];

export default class DoughnutRechart extends PureComponent {
  
  render() {
    return (
      <PieChart width={400} height={250}>
        <Pie data={data02} dataKey="value" cx={200} cy={125} innerRadius={70} outerRadius={90} fill="#82ca9d" label />
      </PieChart>
    );
  }
}
