import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const data = [10, 20, 30, 40, 50, 25, 35];
    const svg = d3.select(svgRef.current);

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 300]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([150, 0]);

    const line = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX);

    svg.selectAll('path')
      .data([data])
      .join('path')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'blue');
  }, []);

  return (
    <svg ref={svgRef} width={400} height={200} />
  );
};

export default LineChart;