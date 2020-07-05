import React, { useState, useEffect } from 'react';
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";

// Resolves charts dependancy
charts(FusionCharts);

export default function Doughnut2DChart() {
    const [data, setData] = useState("90%");

    const dataSource = {
        "chart": {
            caption: "Quality",
            showBorder: "0",
            captionfontcolor: "#686980",
            captionfontsize: "16",
            captionalignment: "left",
            showShadow: "0",
            use3DLighting: "0",
            showLabels: "0",
            showValues: "0",
            paletteColors: "#efefef,#11DFF6",
            bgColor: "#1D1B41",
            bgAlpha: "100",
            canvasBgAlpha: "0",
            doughnutRadius: "75",
            pieRadius: "90",
            enableSlicing: "0",
            plotBorderAlpha: "0",
            showToolTip: "0",
            baseFontSize: "14",
            logoURL: "assets/Icons/quality.svg",
            logoScale: "100",
            logoAlpha: "100",
            logoPosition: "TR",
            logoTopMargin: "10",
            defaultCenterLabel: null,
            centerLabelBold: "1",
            centerLabelFontSize: "25",
            enableRotation: "0",
            captionfont: "avenir-heavy",
            baseFont: "avenir-medium",
            startingAngle: "0",
            animateClockwise: "1"
          },
          data:  [
                {
                    value: "10"
                },
                {
                    value: "90"
                }
            ]
        // chart: {
        //     caption: "Bandwidth Used",
        //     showpercentvalues: "1",
        //     defaultcenterlabel: data,
        //     aligncaptionwithcanvas: "1",
        //     captionpadding: "1",
        //     captionAlignment: "left",
        //     bgColor: "#262A33",
        //     bgAlpha: "100",
        //     showBorder: "0",
        //     baseFont: "avenir-heavy",
        //     baseFontSize: "16",
        //     baseFontColor: "#ffffff",
        //     theme: "fusion"
        // },
        // data: [
        //     {
        //         value: "90"
        //     },
        //     {
        //         value: "10"
        //     }
        // ]
    };

    return (
        <ReactFusioncharts
            type="doughnut2d"
            width="100%"
            height="250"
            dataFormat="JSON"
            dataSource={dataSource}
        />
    )
}
