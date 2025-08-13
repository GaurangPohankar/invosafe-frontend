"use client";
import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import ChartTab from "../../common/ChartTab";
import dynamic from "next/dynamic";
import { invoiceApi } from "@/library/invoiceApi";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface StatisticsData {
  series: Array<{
    name: string;
    data: number[];
  }>;
}

export default function StatisticsChart() {
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await invoiceApi.getInvoiceStatistics(selectedYear);
        setStatisticsData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch statistics');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedYear]);

  const options: ApexOptions = {
    legend: {
      show: true, // Show legend for multiple series
      position: "top",
      horizontalAlign: "left",
      fontSize: "12px",
      fontFamily: "Outfit, sans-serif",
      markers: {
        size: 12,
      },
    },
    colors: ["#10B981", "#3B82F6", "#EF4444", "#8B5CF6"], // Green, Blue, Red, Purple
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2, 2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.3,
        opacityTo: 0.1,
      },
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: "light",
      x: {
        format: "MMM yyyy",
      },
      y: {
        formatter: function(value) {
          return value.toString();
        },
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  // Use API data if available, otherwise use fallback
  const series = statisticsData?.series || [
    {
      name: "Searched",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Financed",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Rejected",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Repaid",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Invoice Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Monthly invoice status breakdown for {selectedYear}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="text-red-500 text-sm mb-2">{error}</div>
            <button
              onClick={() => setSelectedYear(selectedYear)}
              className="px-4 py-2 text-sm bg-brand-500 text-white rounded-md hover:bg-brand-600"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={310}
            />
          </div>
        </div>
      )}
    </div>
  );
}
