import React from 'react';
import PropTypes from 'prop-types';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

import { XYPlot, MarkSeriesCanvas, LineSeriesCanvas } from 'react-vis';

// /**
//  * Create the list of nodes to render.
//  * @returns {Array} Array of nodes.
//  * @private
//  */
// function generateSimulation(props) {
//     const { data, height, width, maxSteps, strength } = props;
//     if (!data) {
//         return { nodes: [], links: [] };
//     }

//     // copy the data
//     const nodes = data.nodes.map(d => ({ ...d }));
//     const links = data.links.map(d => ({ ...d }));

//     if(!nodes.length || !links.length) {
//         return { nodes: [], links: [] };
//     }

//     // build the simuatation
//     const simulation = forceSimulation(nodes)
//         .force('link', forceLink(links).id(d => d.id))
//         .force('charge', forceManyBody())
//         .force('center', forceCenter(width / 2, height / 2))
//         .stop();

//     simulation.force('link').links(links);

//     const upperBound = Math.ceil(
//         Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
//     );
//     for (let i = 0; i < Math.min(maxSteps, upperBound); ++i) {
//         simulation.tick();
//     }

//     return { nodes, links };
// }

// class ForceDirectedGraph extends React.Component {
//     static get defaultProps() {
//         return {
//             className: '',
//             data: { nodes: [], links: [] },
//             maxSteps: 50
//         };
//     }

//     static get propTypes() {
//         return {
//             className: PropTypes.string,
//             data: PropTypes.object.isRequired,
//             height: PropTypes.number.isRequired,
//             width: PropTypes.number.isRequired,
//             steps: PropTypes.number
//         };
//     }

//     constructor(props) {
//         super(props);
//         this.state = {
//             data: generateSimulation(props)
//         };
//     }

//     componentWillReceiveProps(nextProps) {
//         this.setState({
//             data: generateSimulation(nextProps)
//         });
//     }

//     render() {
//         const { className, height, width, animation } = this.props;
//         const { data } = this.state;
//         const { nodes, links } = data;
//         return (
//             <XYPlot width={width} height={height} className={className}>
//                 {links.map(({ source, target }, index) => {
//                     return (
//                         <LineSeriesCanvas
//                             animation={animation}
//                             color={'#B3AD9E'}
//                             key={`link-${index}`}
//                             opacity={0.3}
//                             data={[{ ...source, color: null }, { ...target, color: null }]}
//                         />
//                     );
//                 })}
//                 <MarkSeriesCanvas
//                     data={nodes}
//                     animation={animation}
//                     colorType={'category'}
//                     stroke={'#ddd'}
//                     strokeWidth={2}
//                 />
//             </XYPlot>
//         );
//     }
// }

// ForceDirectedGraph.displayName = 'ForceDirectedGraph';

// export default ForceDirectedGraph;


// import D3blackbox from "d3blackbox";
// import * as d3 from "d3";
import axios from 'axios';

// const ForceDirectedGraph = D3blackbox(async function (anchor, props, state) {
//     const svg = d3.select(anchor.current);

//     // the rest of your D3 code
//     const res = await axios.get(`https://brothereye.herokuapp.com/graph`)

//     console.log(res.data);
//     const data = res.data;


//     const drag = simulation => {

//         function dragstarted(d) {
//             if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//             d.fx = d.x;
//             d.fy = d.y;
//         }

//         function dragged(d) {
//             d.fx = d3.event.x;
//             d.fy = d3.event.y;
//         }

//         function dragended(d) {
//             if (!d3.event.active) simulation.alphaTarget(0);
//             d.fx = null;
//             d.fy = null;
//         }

//         return d3.drag()
//             .on("start", dragstarted)
//             .on("drag", dragged)
//             .on("end", dragended);
//     }

//     const color = function () {
//         const scale = d3.scaleOrdinal(d3.schemeCategory10);
//         return d => scale(d.group);
//     }

//     let links = data.links.map(d => Object.create(d));
//     let nodes = data.nodes.map(d => Object.create(d));

//     links = links.map((link) => {
//         return {
//             source: link.from,
//             target: link.to,
//             value: 10
//         }
//     })

//     const simulation = d3.forceSimulation(nodes)
//         .force("link", d3.forceLink(links).id(d => d.id))
//         .force("charge", d3.forceManyBody())
//         .force("center", d3.forceCenter(600 / 2, 600 / 2));

//     const link = svg.append("g")
//         .attr("stroke", "#999")
//         .attr("stroke-opacity", 0.6)
//         .selectAll("line")
//         .data(links)
//         .join("line")
//         .attr("stroke-width", d => Math.sqrt(d.value));

//     const node = svg.append("g")
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 1.5)
//         .selectAll("circle")
//         .data(nodes)
//         .join("circle")
//         .attr("r", 5)
//         .attr("fill", color)
//         .call(drag(simulation));

//     node.append("title")
//         .text(d => d.id);

//     simulation.on("tick", () => {
//         link
//             .attr("x1", d => d.source.x)
//             .attr("y1", d => d.source.y)
//             .attr("x2", d => d.target.x)
//             .attr("y2", d => d.target.y);

//         node
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });



// });

// export default ForceDirectedGraph;

import vis from 'vis-network';
import ReactDOM from "react-dom";

export default class Topology extends React.Component {
    state = {
        graph: {
            nodes: [],
            edges: []
        }
    };

    componentDidMount() {
        axios.get(`https://brothereye.herokuapp.com/graph`)
            .then(res => {
                console.log(res.data);
                let data = res.data;
                this.setState({ graph: {nodes: data.nodes,edges: data.links} });
                this.draw();
            }
        );
        
    }

    // componentDidUpdate() {
    //     this.darw();
    // }

    draw() {
        let nodes = null;
        let edges = null;
        let network = null;

        let pc = '../Icons/computer.png';
        let server = '../Icons/server.png';
        let router = '../Icons/router (1).png';

        //var DIR = '../img/refresh-cl/';
        let EDGE_LENGTH_MAIN = 150;
        let EDGE_LENGTH_SUB = 50;
        // Create a data table with nodes.
        nodes = [
            { id: 1, label: "dep1" },
            { id: 2, label: "dep2" },
            { id: 3, label: "dep3" },
            { id: 4, label: "dep4" },
            { id: 5, label: "dep5" }
        ];

        // Create a data table with links.
        edges = [
            { from: 1, to: 2, label: "depends on" },
            { from: 1, to: 3, label: "depends on" },
            { from: 2, to: 4, label: "depends on" },
            { from: 2, to: 5, label: "depends on" }
        ];

        // create a network
        let container = ReactDOM.findDOMNode(this.refs.graph);

        let data = {
            nodes: nodes,
            edges: edges
        };

        let options = {
            autoResize: true,
            edges: {
                font: {
                    color: "black",
                    face: "Tahoma",
                    size: 10,
                    align: "top",
                    strokeWidth: 0.3,
                    strokeColor: "black"
                },
                shadow: true
            },
            nodes: {
                borderWidth: 1,
                borderWidthSelected: 2,
                shape: "circle",
                color: {
                    background: "#F46D43",
                    border: "black"
                },
                font: {
                    color: "white",
                    size: 10,
                    face: "Tahoma",
                    background: "none",
                    strokeWidth: 0,
                    strokeColor: "#ffffff"
                },
                shadow: true
            },
            groups: {
                PC: {
                    shape: 'circularImage',
                    image: pc,
                    cid: 0
                },
                switch: {
                    shape: 'circularImage',
                    image: router,
                    cid: 1
                },
                vlan: {
                    shape: 'circularImage',
                    image: server,
                    cid: 2
                }
            },
            physics: true,
            layout: {
                randomSeed: undefined,
                improvedLayout: true,
                hierarchical: {
                    enabled: false,
                    levelSeparation: 120,
                    nodeSpacing: 100,
                    treeSpacing: 100,
                    blockShifting: true,
                    edgeMinimization: true,
                    parentCentralization: true,
                    direction: "UD", // UD, DU, LR, RL
                    sortMethod: "directed" // hubsize, directed
                }
            }
        };

        network = new vis.Network(container, this.state.graph, options);
        console.log(network)
        return network;
    }

    render() {
        return (
            <div ref="graph" style={{width:"500px", height:"500px"}}>
            </div>
        );
    }
}

