import React, { useState, useEffect } from 'react';

import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";

// Resolves charts dependancy
charts(FusionCharts);

const dataSource = {
  chart: {
    theme: "fusion",
    caption: "Total stars count",
    captionfont: "avenir-heavy",
    subCaption: "[GitHub]",
    captionalignment: "left",
    subcaptionalignment: "left",
    subcaptionfontcolor: "#979797",
    baseFont: "avenir-medium",
    valueFont: "avenir-medium",
    valueFontColor: "#5A5B75",
    alignCaptionWithCanvas: "0",
    captionFontColor: "#5A5B75",
    captionFontSize: "16",
    yaxisvaluedecimals: "0",
    showyaxisvalues: "0",
    showlimits: "0",
    showupperlimit: "0",
    adjustDiv: "0",
    logoURL: "assets/Icons/noun_Star.svg",
    logoScale: "75",
    logoAlpha: "100",
    logoTopMargin: "13",
    logoPosition: "TR",
    divlinealpha: "0",
    showValues: "1",
    placevaluesinside: "0",
    numDivLines: "1",
    anchorbgcolor: "#ffffff",
    anchorradius: "5",
    yaxismaxvalue: null,
    plotToolText: "<b>$label</b> framework<br/>Starts Count : <b>$datavalue</b>"
  },
  data: [
    {
      label: "Russia",
      value: "115"
    },
    {
      label: "UAE",
      value: "100"
    },
    {
      label: "US",
      value: "30"
    },
    {
      label: "China",
      value: "30"
    }
  ]
};

export default class ColumnChart extends React.Component {
  render() {
    return (
      <ReactFusioncharts
        type="column2d"
        width="100%"
        height="900"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    );
  }
}
