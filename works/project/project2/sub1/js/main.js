$(function(){
    Highcharts.chart('container', {
        chart: {
            type: 'column',
            style: {//차트 전체 스타일 지정
				color: '#fff',
			    fontFamily: 'notokr',
				fontWeight:'400'
			},
			backgroundColor:'rgba(255, 255, 255, 0)',
        },
        credits: {enabled: false},//highchart 워터마크 숨김처리
        title: {
            text: ''
        },
        xAxis: {
            height: '350px',
            categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
            ],
            labels: {
                y: 20,
                style: {
                    color:'#fff',
                    fontSize: '12px'
                },
            },
            lineColor: '#737375',//x축 선 색상 지정.
            tickWidth: 0,//x축 label 사이 표지자 너비
        },
        yAxis: [{
            height: '350px',
            title: {
                text: '주문수(Orders)',
                style:{color:'gray', fontSize: 16},
                x: -12
            },
            min: 0,
            max: 160,
            tickInterval: 40,
        }, {
            height: '350px',
            title: {
                text: '낱개 수량(Pieces)',
                style:{color:'gray', fontSize: 16},
                x: 12
            },
            min: 0,
            max: 240,
            tickInterval: 60,
            opposite: true,
        }],
        legend: {
            shadow: false,
            floating: true,//범례를 차트 영역 위로 띄울 시 true 지정.
			align: 'left',//수평 정렬 지정
            verticalAlign: 'bottom',//수직 정렬 지정.
            symbolRadius:10,//범례 심볼 radius 지정
            symbolWidth:12,
            symbolHeight:12,
            itemDistance:17,//범례 간 간격 지정.
            useHTML: true,
            backgroundColor: '#1E262D',
            width: '95%',
            itemStyle: {
                color:'#fff',
                fontSize: '14px',
                fontWeight:'400'
            },
            x: 55,//가로 위치 지정.
            y: 10,//세로 위치 지정.
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            },
        },
        series: [{
            name: '단포 ODR',
            type: 'column',
            color: 'rgba(82, 217, 235, .6)',
            data: [150, 73, 20, 150, 73, 20, 150, 73, 20, 150, 73, 20, 150, 73, 20, 150, 73, 20, 150, 73, 20, 150, 73, 20, 150, 73, 20, 150, 73, 20, 150],
            pointPadding: 0.3,
            pointPlacement: -0.2
        }, {
            name: '단포 PCS',
            type: 'column',
            color: 'rgba(82, 77, 235, 1)',
            data: [140, 90, 40, 140, 90, 40, 140, 90, 40, 140, 90, 40, 140, 90, 40, 140, 90, 40, 140, 90, 40, 140, 90, 40, 140, 90, 40, 140, 90, 40, 140],
            pointPadding: 0.4,
            pointPlacement: -0.2
        }, {
            name: '합포 ODR',
            type: 'column',
            color: 'rgba(77, 255, 190, .6)',
            data: [183.6, 178.8, 198.5, 183.6, 178.8, 198.5, 183.6, 178.8, 198.5, 183.6, 178.8, 198.5, 183.6, 178.8, 198.5, 183.6, 178.8, 198.5, 183.6, 178.8, 198.5, 183.6, 178.8, 198.5, 183.6, 178.8, 198.5, 183.6, 178.8, 198.5, 183.6],
            tooltip: {
                valuePrefix: '$',
                valueSuffix: ' M'
            },
            pointPadding: 0.3,
            pointPlacement: 0.2,
            yAxis: 1
        }, {
            name: '합포 PCS',
            type: 'column',
            color: 'rgba(41, 135, 100, 1)',
            data: [203.6, 198.8, 208.5, 203.6, 198.8, 208.5, 203.6, 198.8, 208.5, 203.6, 198.8, 208.5, 203.6, 198.8, 208.5, 203.6, 198.8, 208.5, 203.6, 198.8, 208.5, 203.6, 198.8, 208.5, 203.6, 198.8, 208.5, 203.6, 198.8, 208.5, 203.6],
            tooltip: {
                valuePrefix: '$',
                valueSuffix: ' M'
            },
            pointPadding: 0.4,
            pointPlacement: 0.2,
            yAxis: 1
        }, {
            name: '입고 PCS',
            type: 'line',
            color: 'rgba(246, 22, 7, 1)',
            data: [45, 70, 35, 33, 45, 20, 14, 60, 75, 63, 44, 42, 50, 32, 28, 30, 35, 25, 20, 16, 36, 20, 18, 20, 25, 38, 40, 25, 34, 18, 20],
            tooltip: {
                valuePrefix: '$',
                valueSuffix: ' M'
            },
            pointPadding: 0.4,
            pointPlacement: 0.2,
            yAxis: 1
        }]
    });
});