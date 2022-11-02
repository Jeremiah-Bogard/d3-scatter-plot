const width = 920;
const height = 630;

var xScale = d3.scaleLinear().range([0, width-130]);
var yScale = d3.scaleTime().range([0, height-130]);

var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', 'light gray')
    .append('g')
    .attr('transform', 'translate(60, 100)');

let tooltip = document.getElementById('tooltip');

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(res => res.json())
    .then(data => {
        data.forEach(d => {
            d.Place = +d.Place;
            var parsedTime = d.Time.split(':');
            d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
        })

        xScale.domain([
            d3.min(data, d => d.Year - 1),
            d3.max(data, d => d.Year + 1)
        ]);
        yScale.domain(d3.extent(data, d => d.Time));

        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${height-130})`)
            .call(xAxis)

        svg.append('g')
            .attr('id', 'y-axis')
            .call(yAxis)
        
        svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('data-xvalue', d => d.Year)
            .attr('data-yvalue', d => d.Time)
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.Year))
            .attr('cy', d => yScale(d.Time))
            .attr('r', 6)
            .style('fill', d => (d.Doping === '') ? '#fa0' : '#00f')
            .on('mouseover', (d, i) => {
                tooltip.innerHTML = `
                    ${i.Name}
                    <br>
                    Year: ${i.Year}, Time: ${i.Time.getMinutes()}:${i.Time.getSeconds()}`;
                if(i.Doping !== '') {
                    tooltip.innerHTML += `<br><br>${i.Doping}`;
                }
                tooltip.dataset.year = i.Year;
                tooltip.style.top = `${d.clientY}px`
                tooltip.style.left = `${d.clientX}px`
                tooltip.style.opacity = 1;
            }).on('mouseout', (d, i) => {
                tooltip.style.opacity = 0;
            });

    })
    .catch(err => console.error(err));