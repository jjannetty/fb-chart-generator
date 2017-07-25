(function() {
  var X, Y, barChartButton, clearGraphs, drawBarChart, drawLineChart, drawLines, formatNumber, getAxisLabels, getBarXLabels, getData, getDomain, getFontSize, getHeigth, getMargin, getMonthArray, getSize, getWidth, lineChartButton, translateBarWidth;

  formatNumber = function(number, longest) {
    var float;
    float = parseFloat(number);
    if (longest.length >= 5 && longest.length < 7) {
      return float / 1000;
    } else if (longest.length >= 7) {
      return float / 1000000;
    } else {
      return float;
    }
  };

  getData = function(type) {
    var data, dataArray, longest;
    data = document.getElementById(type + "-data").value.replace(/\$|K|k|\,|\%/g, '').split(' ');
    longest = data.reduce(function(a, b) {
      if (a.length >= b.length) {
        return a;
      } else {
        return b;
      }
    });
    dataArray = data.map(function(number) {
      return formatNumber(number, longest);
    });
    if (isNaN(dataArray[0])) {
      return [1, 2, 3, 4, 5];
    } else {
      return dataArray;
    }
  };

  getAxisLabels = function(type) {
    var labels;
    labels = document.getElementById(type + "-axis-labels").value.split(',');
    if (!labels[0].length) {
      return ['x-axis', 'y-axis'];
    } else {
      return labels;
    }
  };

  getWidth = function(type) {
    var width;
    width = void 0;
    if (type === 'line') {
      width = parseInt($('.line-width:checked').val());
    } else {
      width = parseInt(document.getElementById(type + "-width").value);
    }
    if (isNaN(width)) {
      return 500;
    } else {
      return width;
    }
  };

  getSize = function() {
    var size;
    size = $('.line-size:checked').val().split(',');
    return size.map(function(string) {
      return parseInt(string);
    });
  };

  getMargin = function(type) {
    var margin;
    margin = document.getElementById(type + "-margin").value.split(',');
    return margin.map(function(number) {
      return parseInt(number);
    });
  };

  getMonthArray = function() {
    var months;
    return months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  };

  getHeigth = function(type) {
    var height;
    height = void 0;
    if (type === 'line') {
      height = parseInt($('.line-height:checked').val());
    } else {
      height = parseInt(document.getElementById(type + "-height").value);
    }
    if (isNaN(height)) {
      return 300;
    } else {
      return height;
    }
  };

  getBarXLabels = function() {
    var labelArray, labels, value;
    labels = Array.from(document.getElementsByClassName('x-labels'));
    value = labels.find(function(element) {
      return element.checked;
    }).value;
    return labelArray = value.split(',');
  };

  clearGraphs = function() {
    d3.select('#bar-graph svg').remove();
    return d3.select('#line-graph svg').remove();
  };

  getDomain = function(type, data) {
    var domain;
    domain = parseInt(document.getElementById(type + "-domain").value);
    if (isNaN(domain)) {
      return d3.max(data);
    } else {
      return domain;
    }
  };

  getFontSize = function(type) {
    return parseInt(document.getElementById(type + "-font-size").value);
  };

  translateBarWidth = function(i, barWidth) {
    return ['translate(', (i * barWidth) + 5, ',0)'].join('');
  };

  drawBarChart = function() {
    var bar, barChart, barWidth, data, domain, fontSize, height, html, margin, width, xAxis, xAxisScale, xLabels, y, yAxisLeft;
    clearGraphs();
    data = getData('bar');
    domain = getDomain('bar', data);
    margin = getMargin('bar');
    width = getWidth('bar') - margin[0];
    height = getHeigth('bar') - margin[1];
    barWidth = width / data.length;
    xLabels = getBarXLabels();
    fontSize = getFontSize('bar');
    y = d3.scaleLinear().domain([0, domain]).range([height, 0]);
    xAxisScale = d3.scaleLinear().domain([0, xLabels.length - 1]).range([0, width]);
    yAxisLeft = d3.axisLeft(y).ticks(5).tickSize(0);
    barChart = d3.select('#bar-graph').append('svg').attr('viewBox', '0 0 ' + (width + margin[0]) + ' ' + (height + margin[1])).attr('width', width + margin[0]).attr('height', height + margin[1]).append('g').attr('transform', "translate(" + margin[0] + ", 10)");
    bar = barChart.selectAll('g').data(data).enter().append('g').attr('transform', function(d, i) {
      return translateBarWidth(i, barWidth);
    });
    bar.append('rect').attr('y', function(d) {
      return y(d);
    }).attr('height', function(d) {
      return height - y(d);
    }).attr('width', barWidth - 10).attr('fill', '#00B8D4');
    bar.append('text').attr('x', (barWidth / 2) - 5).attr('y', height + (margin[1] / 2)).text(function(d, i) {
      return xLabels[i];
    }).attr('text-anchor', 'middle');
    barChart.append('g').call(yAxisLeft);
    xAxis = barChart.append('g').attr('transform', "translate(0, 0.5)");
    xAxis.append('line').attr('x1', 0).attr('y1', height).attr('x2', width).attr('y2', height);
    d3.selectAll('text').attr('font-size', fontSize).attr('font-family', 'Open Sans').attr('color', '#282832');
    d3.selectAll('line').attr('stroke', '#282832').attr('stroke-width', 1);
    d3.select('.domain').attr('stroke', '#282832').attr('stroke-width', 1);
    html = d3.select('#bar-graph').html();
    return d3.select('.html').text(html);
  };

  Y = function(data, height, domain) {
    return d3.scaleLinear().domain([0, domain]).range([height, 0]);
  };

  X = function(data, width) {
    return d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
  };

  drawLines = function(chart, data, width, height, color, domain) {
    var fill, line, x, y;
    y = Y(data, height, domain);
    x = X(data, width);
    line = d3.line().x(function(d, i) {
      return x(i);
    }).y(function(d) {
      return y(d);
    });
    fill = d3.area().x(function(d, i) {
      return x(i);
    }).y1(function(d) {
      return y(d);
    }).y0(height);
    chart.append('g').append('path').datum(data).attr('d', line).attr('fill', 'none').attr('stroke', color).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').attr('stroke-width', 1);
    return chart.append('g').append('path').datum(data).attr('d', fill).attr('fill', color).attr('style', 'opacity: 0.2');
  };

  drawLineChart = function() {
    var chart, data1, data2, domain1, domain2, fontSize, height, html, margin, months, size, width, x, xAxis, xAxisScale, y1, y2, yAxisLeft, yAxisRight;
    clearGraphs();
    data1 = getData('line-1');
    data2 = getData('line-2');
    size = getSize();
    console.log(size);
    margin = getMargin('line');
    width = size[0] - margin[0];
    height = size[1] - margin[1];
    months = getMonthArray();
    domain1 = getDomain('line-1', data1);
    domain2 = getDomain('line-2', data2);
    fontSize = size[2];
    chart = d3.select('#line-graph').append('svg').attr('viewBox', '0 0 ' + (width + margin[0]) + ' ' + (height + margin[1])).attr('width', width + margin[0]).attr('height', height + margin[1]).append('g').attr('transform', "translate(" + (margin[0] / 2) + ", " + (margin[1] / 3) + ")");
    drawLines(chart, data2, width, height, '#00B8D4', domain2);
    drawLines(chart, data1, width, height, '#FF5252', domain1);
    y1 = Y(data1, height, domain1);
    y2 = Y(data2, height, domain2);
    x = X(data1, width);
    xAxis = chart.append('g').attr('transform', "translate(0, 0.5)");
    xAxisScale = d3.scaleLinear().domain([0, months.length - 1]).range([0, width]);
    yAxisLeft = d3.axisLeft(y1).ticks(10).tickSize(0);
    yAxisRight = d3.axisRight(y2).ticks(10).tickSize(0);
    chart.append('g').call(yAxisLeft);
    chart.append('g').attr('transform', "translate(" + width + " 0)").call(yAxisRight);
    xAxis.append('line').attr('x1', 0).attr('y1', height).attr('x2', width).attr('y2', height).attr('stroke-width', 1).attr('stroke', '#282832');
    xAxis.selectAll('text').data(months).enter().append('text').attr('x', function(d, i) {
      return xAxisScale(i);
    }).attr('y', height + 11).attr('text-anchor', 'middle').text(function(d) {
      return d;
    });
    d3.selectAll('text').attr('font-size', fontSize).attr('font-family', 'Open Sans').attr('color', '#282832');
    d3.select('.domain').attr('stroke', '#282832').attr('stroke-width', 1);
    d3.selectAll('.tick line').attr('stroke', '#282832').attr('stroke-width', 1);
    html = d3.select('#line-graph').html();
    return d3.select('.html').text(html);
  };

  barChartButton = document.getElementById('draw-bar-graph');

  lineChartButton = document.getElementById('draw-line-graph');

  barChartButton.onclick = function() {
    return drawBarChart();
  };

  lineChartButton.onclick = function() {
    return drawLineChart();
  };

}).call(this);
