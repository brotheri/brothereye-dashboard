import React from 'react';

// import './force-directed.scss';
import ForceDirectedGraph from '../components/force.directed.graph';
import Graph from "react-graph-vis";
import axios from 'axios';

import pc from '../Icons/computer.png'
import server from '../Icons/server.png'
import router from '../Icons/router (1).png'

import D3blackbox from "d3blackbox";
import * as d3 from "d3";


export default class Vis extends React.Component {
    // state = {
    //     graph: { 
    //         nodes: [], 
    //         links: [] 
    //     }
    // };

    // componentDidMount() {
    //     axios.get(`https://brothereye.herokuapp.com/graph`)
    //         .then(res => {
    //             console.log(res.data);
    //             let data = res.data;
    //             data.links = data.links.map((link) => {
    //                 return {
    //                     source: link.from,
    //                     target: link.to,
    //                     value: 2
    //                 }
    //             })
    //             this.setState({ graph: data });
    //         });
    // }

    render() {
        return (
            // <div className="force-directed">
            //     <ForceDirectedGraph
            //         data={this.state.graph}
            //         height={500}
            //         width={500}
            //         animation
            //     />
            // </div>
            <svg>
                <ForceDirectedGraph/>
            </svg>
        );
    }
}