"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { creditsApi } from "@/library/creditsApi";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyChartResponse {
  data: number[];
  year: number;
  lender_id: number;
  total_annual_credits: number;
}

export default function MonthlySalesChart() {
  const [monthlyData, setMonthlyData] = useState<MonthlyChartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Generate years for dropdown (current year and 4 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        const data = await creditsApi.getMonthlyChartData(selectedYear);
        setMonthlyData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch monthly data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch monthly data');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [selectedYear]);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val} credits`,
      },
    },
  };

  const series = [
    {
      name: "Credits Used",
      data: monthlyData?.data || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function toggleYearDropdown() {
    setYearDropdownOpen(!yearDropdownOpen);
  }

  function closeYearDropdown() {
    setYearDropdownOpen(false);
  }

  function selectYear(year: number) {
    setSelectedYear(year);
    closeYearDropdown();
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Credits Usage
          </h3>
        </div>
        <div className="flex items-center justify-center h-[180px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Credits Usage
          </h3>
        </div>
        <div className="flex items-center justify-center h-[180px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Credits Usage
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Credits used per month in {selectedYear}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Year Selector Dropdown */}
          <div className="relative inline-block">
            <button 
              onClick={toggleYearDropdown} 
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
            >
              {selectedYear}
              <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Dropdown
              isOpen={yearDropdownOpen}
              onClose={closeYearDropdown}
              className="w-24 p-2 min-w-0"
            >
              {years.map((year) => (
                <DropdownItem
                  key={year}
                  tag="button"
                  onItemClick={() => selectYear(year)}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  {year}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
      
      {monthlyData && (
        <div className="mt-4 px-2 pb-4">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Total Annual Credits: {monthlyData.total_annual_credits}</span>
            <span>Total Used: {monthlyData.data.reduce((sum, monthCredits) => sum + monthCredits, 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
