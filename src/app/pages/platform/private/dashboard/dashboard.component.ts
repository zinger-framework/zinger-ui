import {Component, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from 'ng-apexcharts';
import {BaseComponent} from "../../../../base.component";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  grid: ApexGrid;
  colors: Array<string>;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  stroke: ApexStroke;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent {
  @ViewChild('txn_chart') chart: ChartComponent;
  public txnChartOptions: Partial<ChartOptions>;
  public newRegChartOptions: Partial<ChartOptions>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.txnChartOptions = {
      chart: {
        height: 350,
        type: 'bar',
        parentHeightOffset: 0,
        fontFamily: 'Poppins, sans-serif',
        toolbar: {
          show: false,
        },
      },
      colors: ['#1b00ff', '#f56767'],
      grid: {
        borderColor: '#c7d2dd',
        strokeDashArray: 5,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      series: [{
        name: 'Transaction Cost',
        data: [40, 28, 47, 22, 34, 25]
      }, {
        name: 'Profit',
        data: [30, 20, 37, 10, 28, 11]
      }],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        labels: {
          style: {
            colors: ['#353535'],
            fontSize: '16px',
          },
        },
        axisBorder: {
          color: '#8fa6bc',
        }
      },
      yaxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            colors: '#353535',
            fontSize: '16px',
          },
        },
        axisBorder: {
          color: '#f00',
        }
      },
      legend: {
        horizontalAlign: 'right',
        position: 'top',
        fontSize: '16px',
        offsetY: 0,
        labels: {
          colors: '#353535',
        },
        markers: {
          width: 10,
          height: 10,
          radius: 15,
        },
        itemMargin: {
          vertical: 0
        },
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        style: {
          fontSize: '15px',
          fontFamily: 'Poppins, sans-serif',
        },
        y: {
          formatter: undefined,
          title: {
            formatter: (val) => val,
          }
        }
      }
    };
    this.newRegChartOptions = {
      series: [{
        name: 'Users',
        data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
      }],
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        }
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0
        }
      },
      stroke: {
        width: 7,
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: ['1/11/2020', '2/11/2020', '3/11/2020', '4/11/2020', '5/11/2020', '6/11/2020', '7/11/2020', '8/11/2020', '9/11/2020', '10/11/2020', '11/11/2020', '12/11/2020', '1/11/2021', '2/11/2021', '3/11/2021', '4/11/2021', '5/11/2021', '6/11/2021'],
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#1b00ff'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        },
      },
      markers: {
        size: 4,
        colors: ['#FFA41B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      yaxis: {
        min: -10,
        max: 40,
        title: {
          text: 'Users',
        },
      }
    };
  }
}
