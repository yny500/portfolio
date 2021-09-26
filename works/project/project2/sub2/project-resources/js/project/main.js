$(function(){

/* highchart */
function renderIcons() {

    this.series[0].icon = this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8, 'M', 8, -8, 'L', 16, 0, 8, 8])
        .attr({
            'stroke': '#303030',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': 2,
            'zIndex': 10
        })
        .translate(190, 61)
        .add(this.series[0].group);

}

  var PieChart1 = Highcharts.chart('pie-chart', {
      chart: {
        type: 'solidgauge',
        height: '50%',
        style: {//차트 전체 스타일 지정
            color: '#fff',
            fontFamily: 'notokr',
            fontWeight:'400'
        },
        backgroundColor:'rgba(255, 255, 255, 0)',
      },
      credits: {enabled: false},
      title: {
        text: '',
        style: {
          fontSize: '24px',
        }
      },
      exporting: {
          enabled: false
      },

      tooltip: {
        enabled: false
      },

      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{ // Track for Move
          outerRadius: '112%',
          innerRadius: '88%',
          backgroundColor: Highcharts.Color('#e5e5e5')
            .setOpacity(0.3)
            .get(),
          borderWidth: 0
        }]
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: false
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: true
        }
      },

      series: [{
        name: '',
        data: [{
          color: 'rgb(0, 231, 255)',
          radius: '112%',
          innerRadius: '88%',
          y: 28.8
        }]
      }]
    });

    var PieChart2 = Highcharts.chart('pie-chart2', {
      chart: {
        type: 'solidgauge',
        height: '50%',
        style: {//차트 전체 스타일 지정
            color: '#fff',
            fontFamily: 'notokr',
            fontWeight:'400'
        },
        backgroundColor:'rgba(255, 255, 255, 0)',
      },
      credits: {enabled: false},
      title: {
        text: '',
        style: {
          fontSize: '24px',
        }
      },
      exporting: {
          enabled: false
      },

      tooltip: {
        enabled: false
      },

      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{ // Track for Move
          outerRadius: '112%',
          innerRadius: '88%',
          backgroundColor: Highcharts.Color('#e5e5e5')
            .setOpacity(0.3)
            .get(),
          borderWidth: 0
        }]
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: false
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: true
        }
      },

      series: [{
        name: '',
        data: [{
          color: 'rgb(0, 231, 255)',
          radius: '112%',
          innerRadius: '88%',
          y: 64.5
        }]
      }]
    });

    var PieChart2 = Highcharts.chart('pie-chart3', {
      chart: {
        type: 'solidgauge',
        height: '50%',
        style: {
            color: '#fff',
            fontFamily: 'notokr',
            fontWeight:'400'
        },
        backgroundColor:'rgba(255, 255, 255, 0)',
      },
      credits: {enabled: false},
      title: {
        text: '',
        style: {
          fontSize: '24px',
        }
      },
      exporting: {
          enabled: false
      },

      tooltip: {
        enabled: false
      },

      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{
          outerRadius: '112%',
          innerRadius: '88%',
          backgroundColor: Highcharts.Color('#e5e5e5')
            .setOpacity(0.3)
            .get(),
          borderWidth: 0
        }]
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: false
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: true
        }
      },

      series: [{
        name: '',
        data: [{
          color: 'rgb(237, 32, 123)',
          radius: '112%',
          innerRadius: '88%',
          y: 45.0
        }]
      }]
    });

/* bar-chart */
$(".workspace .picking-1").css({width:"12.5%"});
$(".workspace .picking-2").css({width:"10%"});
$(".workspace .add").css({width:"32.3%"});

$(".box-call .picking-1").css({width:"30%"});
$(".box-call .picking-2").css({width:"50%"});
$(".box-call .add").css({width:"20%"});

$(".picking .picking-1").css({width:"25%"});
$(".picking .picking-2").css({width:"20%"});
});