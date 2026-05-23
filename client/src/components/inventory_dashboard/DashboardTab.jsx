import React from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiUser,
  FiHeart,
  FiArrowRight,
  FiActivity,
  FiChevronDown,
} from "react-icons/fi";
import numberWithCommas from "../../modules/numberwithcomma";

const DashboardTab = ({
  data,
  generateSparkline,
  chartInterval,
  setChartInterval,
  getSparklineData,
  convInterval,
  setConvInterval,
  setActiveTab,
}) => {
  return (
    <div className="flex flex-col gap-[1vh] h-full animate-in fade-in duration-700 pb-[1vh]">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[clamp(8px,1vh,20px)] flex-none lg:flex-[0.7] min-h-0">
        {/* Card 1: Total Views */}
        <div className="bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col justify-between border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group min-h-0">
          <div className="flex justify-between items-start z-10 w-full hover:-translate-y-0.5 transition-transform">
            <div className="flex flex-col">
              <span className="inter text-[clamp(9px,1.1vh,16px)] font-semibold uppercase tracking-[0.08em] leading-none text-gray-700">
                Total Views
              </span>
              <span className="text-[clamp(18px,2.8vh,48px)] font-bold text-gray-900 leading-none mt-[clamp(4px,0.5vh,10px)] kaisei tracking-tight">
                {numberWithCommas(data?.stats?.trends?.views?.current || 0)}
              </span>
              <span
                className={`inter text-[clamp(8px,1.2vh,18px)] font-bold ${Number(data?.stats?.trends?.views?.change) >= 0 ? "text-emerald-500" : "text-red-500"} flex items-center gap-[0.5vh] mt-[clamp(4px,0.5vh,10px)]`}
              >
                {Number(data?.stats?.trends?.views?.change) >= 0 ? (
                  <FiTrendingUp className="text-[clamp(10px,1.4vh,20px)]" />
                ) : (
                  <FiTrendingDown className="text-[clamp(10px,1.4vh,20px)]" />
                )}
                {Math.abs(data?.stats?.trends?.views?.change || 0)}%
                <span className="inter text-gray-400 font-medium hidden sm:inline">
                  vs last 30 days
                </span>
              </span>
            </div>
            <div className="w-[clamp(24px,4vh,60px)] h-[clamp(24px,4vh,60px)] rounded-[clamp(6px,1vh,16px)] bg-[#FFF8F0] justify-center text-[#D48D2A] flex items-center shrink-0">
              <FiEye className="text-[clamp(14px,2vh,32px)]" />
            </div>
          </div>
          <div className="absolute bottom-[clamp(4px,1vh,16px)] left-0 right-0 px-[clamp(8px,1.5vh,24px)] h-[clamp(20px,4vh,60px)] select-none pointer-events-none opacity-80">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d={generateSparkline(data?.stats?.dailyTrends, "views")}
                fill="none"
                stroke="#D48D2A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: "drop-shadow(0px 6px 8px rgba(212, 141, 42, 0.4))",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Leads */}
        <div className="bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col justify-between border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group min-h-0">
          <div className="flex justify-between items-start z-10 w-full hover:-translate-y-0.5 transition-transform">
            <div className="flex flex-col">
              <span className="inter text-[clamp(9px,1.1vh,16px)] font-semibold uppercase tracking-[0.08em] leading-none text-gray-700">
                Total Leads
              </span>
              <span className="text-[clamp(18px,2.8vh,48px)] font-bold text-gray-900 leading-none mt-[clamp(4px,0.5vh,10px)] kaisei tracking-tight">
                {numberWithCommas(data?.stats?.trends?.leads?.current || 0)}
              </span>
              <span
                className={`inter text-[clamp(8px,1.2vh,18px)] font-bold ${Number(data?.stats?.trends?.leads?.change) >= 0 ? "text-emerald-500" : "text-red-500"} flex items-center gap-[0.5vh] mt-[clamp(4px,0.5vh,10px)]`}
              >
                {Number(data?.stats?.trends?.leads?.change) >= 0 ? (
                  <FiTrendingUp className="text-[clamp(10px,1.4vh,20px)]" />
                ) : (
                  <FiTrendingDown className="text-[clamp(10px,1.4vh,20px)]" />
                )}
                {Math.abs(data?.stats?.trends?.leads?.change || 0)}%
                <span className="inter text-gray-400 font-medium hidden sm:inline">
                  vs last 30 days
                </span>
              </span>
            </div>
            <div className="w-[clamp(24px,4vh,60px)] h-[clamp(24px,4vh,60px)] rounded-[clamp(6px,1vh,16px)] bg-blue-50 text-blue-600 justify-center flex items-center shrink-0">
              <FiUser className="text-[clamp(14px,2vh,32px)]" />
            </div>
          </div>
          <div className="absolute bottom-[clamp(4px,1vh,16px)] left-0 right-0 px-[clamp(8px,1.5vh,24px)] h-[clamp(20px,4vh,60px)] select-none pointer-events-none opacity-80">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d={generateSparkline(data?.stats?.dailyTrends, "leads")}
                fill="none"
                stroke="#2563EB"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: "drop-shadow(0px 6px 8px rgba(37, 99, 235, 0.4))",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Saved / Shortlisted */}
        <div className="bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col justify-between border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group min-h-0">
          <div className="flex justify-between items-start z-10 w-full hover:-translate-y-0.5 transition-transform">
            <div className="flex flex-col">
              <span className="inter text-[clamp(9px,1.1vh,16px)] font-semibold uppercase tracking-[0.08em] leading-none text-gray-700">
                Saved / Shortlisted
              </span>
              <span className="text-[clamp(18px,2.8vh,48px)] font-bold text-gray-900 leading-none mt-[clamp(4px,0.5vh,10px)] kaisei tracking-tight">
                {data?.stats?.trends?.saved?.current || 0}
              </span>
              <span
                className={`inter text-[clamp(8px,1.2vh,18px)] font-bold ${Number(data?.stats?.trends?.saved?.change) >= 0 ? "text-emerald-500" : "text-red-500"} flex items-center gap-[0.5vh] mt-[clamp(4px,0.5vh,10px)]`}
              >
                {Number(data?.stats?.trends?.saved?.change) >= 0 ? (
                  <FiTrendingUp className="text-[clamp(10px,1.4vh,20px)]" />
                ) : (
                  <FiTrendingDown className="text-[clamp(10px,1.4vh,20px)]" />
                )}
                {Math.abs(data?.stats?.trends?.saved?.change || 0)}%
                <span className="inter text-gray-400 font-medium hidden sm:inline">
                  vs last 30 days
                </span>
              </span>
            </div>
            <div className="w-[clamp(24px,4vh,60px)] h-[clamp(24px,4vh,60px)] rounded-[clamp(6px,1vh,16px)] bg-emerald-50 text-emerald-600 justify-center flex items-center shrink-0">
              <FiHeart className="text-[clamp(14px,2vh,32px)]" />
            </div>
          </div>
          <div className="absolute bottom-[clamp(4px,1vh,16px)] left-0 right-0 px-[clamp(8px,1.5vh,24px)] h-[clamp(20px,4vh,60px)] select-none pointer-events-none opacity-80">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d={generateSparkline(data?.stats?.dailyTrends, "saved")}
                fill="none"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: "drop-shadow(0px 6px 8px rgba(16, 185, 129, 0.4))",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Est. Lead Value */}
        <div className="bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col justify-between border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group min-h-0">
          <div className="flex justify-between items-start z-10 w-full hover:-translate-y-0.5 transition-transform">
            <div className="flex flex-col">
              <span className="inter text-[clamp(9px,1.1vh,16px)] font-semibold uppercase tracking-[0.08em] leading-none text-gray-700">
                Est. Lead Value
              </span>
              <span className="text-[clamp(18px,2.8vh,48px)] font-bold text-gray-900 leading-none mt-[clamp(4px,0.5vh,10px)] kaisei tracking-tight">
                $
                {((data?.stats?.trends?.value?.current || 0) / 1000000).toFixed(
                  2,
                )}
                M
              </span>
              <span
                className={`inter text-[clamp(8px,1.2vh,18px)] font-bold ${Number(data?.stats?.trends?.value?.change) >= 0 ? "text-emerald-500" : "text-red-500"} flex items-center gap-[0.5vh] mt-[clamp(4px,0.5vh,10px)]`}
              >
                {Number(data?.stats?.trends?.value?.change) >= 0 ? (
                  <FiTrendingUp className="text-[clamp(10px,1.4vh,20px)]" />
                ) : (
                  <FiTrendingDown className="text-[clamp(10px,1.4vh,20px)]" />
                )}
                {Math.abs(data?.stats?.trends?.value?.change || 0)}%
                <span className="inter text-gray-400 font-medium hidden sm:inline">
                  vs last 30 days
                </span>
              </span>
            </div>
            <div className="w-[clamp(24px,4vh,60px)] h-[clamp(24px,4vh,60px)] rounded-[clamp(6px,1vh,16px)] bg-purple-50 text-purple-600 justify-center flex items-center shrink-0">
              <FiTrendingUp className="text-[clamp(14px,2vh,32px)]" />
            </div>
          </div>
          <div className="absolute bottom-[clamp(4px,1vh,16px)] left-0 right-0 px-[clamp(8px,1.5vh,24px)] h-[clamp(20px,4vh,60px)] select-none pointer-events-none opacity-80">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d={generateSparkline(data?.stats?.dailyTrends, "value")}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: "drop-shadow(0px 6px 8px rgba(139, 92, 246, 0.4))",
                }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="flex flex-col lg:flex-row gap-[clamp(8px,1vh,20px)] flex-none lg:flex-[1.4] min-h-0">
        {/* Left Line Chart */}
        <div className="flex-[2] bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden min-h-0">
          <div className="flex justify-between items-center mb-[clamp(8px,1vh,16px)] shrink-0 relative z-10">
            <div className="flex flex-col gap-[clamp(2px,0.4vh,6px)]">
              <h4 className="inter text-[clamp(12px,1.6vh,24px)] font-semibold text-gray-900 leading-none tracking-normal">
                Views vs Leads Over Time
              </h4>
              <div className="flex gap-[clamp(8px,1.5vh,24px)]">
                <div className="flex items-center gap-[clamp(4px,0.6vh,10px)]">
                  <div className="w-[clamp(8px,1.2vh,20px)] h-[clamp(2px,0.3vh,4px)] rounded-full bg-[#D48D2A]"></div>
                  <span className="inter text-[clamp(9px,1.2vh,16px)] font-normal text-gray-500 capitalize leading-none tracking-normal">
                    Views
                  </span>
                </div>
                <div className="flex items-center gap-[clamp(4px,0.6vh,10px)]">
                  <div className="w-[clamp(8px,1.2vh,20px)] h-[clamp(2px,0.3vh,4px)] rounded-full bg-[#1E3B70]"></div>
                  <span className="inter text-[clamp(9px,1.2vh,16px)] font-normal text-gray-500 capitalize leading-none tracking-normal">
                    Leads
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <select
                value={chartInterval}
                onChange={(e) => setChartInterval(e.target.value)}
                className="inter text-[clamp(9px,1.2vh,16px)] font-normal text-gray-600 bg-white border border-gray-200 rounded-[clamp(4px,0.8vh,12px)] pl-[clamp(8px,1vh,16px)] pr-[clamp(24px,3vh,40px)] py-[clamp(4px,0.6vh,10px)] outline-none shadow-sm cursor-pointer hover:bg-gray-50 leading-none tracking-normal appearance-none min-w-[clamp(60px,8vh,120px)]"
              >
                <option value="Day">Day</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
              </select>
              <FiChevronDown className="absolute right-[clamp(8px,1vh,16px)] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[clamp(10px,1.4vh,20px)]" />
            </div>
          </div>

          <div className="flex-1 relative mt-0 min-h-0 w-full">
            <div className="absolute inset-0 pb-[clamp(16px,2vh,32px)] pl-[clamp(24px,3.5vh,56px)] flex flex-col justify-between border-b border-gray-50 pointer-events-none pr-[clamp(8px,1vh,16px)]">
              {[100, 75, 50, 25, 0].map((val, i) => (
                <div
                  key={i}
                  className="w-full border-t border-gray-50 flex items-center h-0 relative"
                >
                  <span className="absolute -left-[clamp(24px,3.5vh,56px)] inter text-[clamp(9px,1.2vh,16px)] text-gray-400 font-normal w-[clamp(20px,3vh,48px)] text-right mt-0 bg-white leading-none tracking-normal">
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 pl-[clamp(32px,4.5vh,72px)] pr-[clamp(12px,2vh,32px)] h-[clamp(16px,2vh,32px)] flex justify-between items-end inter text-[clamp(9px,1.2vh,16px)] font-normal text-gray-400 pb-[clamp(2px,0.3vh,6px)] tracking-normal leading-none">
              {(() => {
                const rawData = (data?.stats?.dailyTrends || []).slice(
                  chartInterval === "Day"
                    ? -3
                    : chartInterval === "Week"
                      ? -7
                      : -30,
                );
                const points = [];
                if (rawData.length > 0) {
                  for (let i = 0; i < 10; i++) {
                    const idx = Math.min(
                      Math.floor((i / 9) * (rawData.length - 1)),
                      rawData.length - 1,
                    );
                    points.push(rawData[idx]);
                  }
                }
                return points
                  .filter((_, i) => i % 2 === 0)
                  .map((d, i) => (
                    <span key={i}>
                      {new Date(d.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  ));
              })()}
            </div>
            <div className="absolute inset-0 pb-[clamp(20px,2.5vh,40px)] pl-[clamp(32px,4.5vh,72px)] pr-[clamp(12px,2vh,32px)] mt-[clamp(4px,0.5vh,12px)]">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 300 100"
                preserveAspectRatio="none"
              >
                {(() => {
                  const rawData = (data?.stats?.dailyTrends || []).slice(
                    chartInterval === "Day"
                      ? -3
                      : chartInterval === "Week"
                        ? -7
                        : -30,
                  );
                  const trendData = [];
                  if (rawData.length > 0) {
                    for (let i = 0; i < 10; i++) {
                      const idx = Math.min(
                        Math.floor((i / 9) * (rawData.length - 1)),
                        rawData.length - 1,
                      );
                      trendData.push(rawData[idx]);
                    }
                  }
                  const viewsData = getSparklineData(
                    trendData,
                    "views",
                    300,
                    100,
                    10,
                  );
                  const leadsData = getSparklineData(
                    trendData,
                    "leads",
                    300,
                    100,
                    10,
                  );
                  return (
                    <>
                      <path
                        d={viewsData.path}
                        fill="none"
                        stroke="#D48D2A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {viewsData.points.map((pt, i) => (
                        <circle
                          key={`v-${i}`}
                          cx={pt.x}
                          cy={pt.y}
                          r="1.5"
                          fill="#D48D2A"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      ))}
                      <path
                        d={leadsData.path}
                        fill="none"
                        stroke="#1E3B70"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {leadsData.points.map((pt, i) => (
                        <circle
                          key={`l-${i}`}
                          cx={pt.x}
                          cy={pt.y}
                          r="1.5"
                          fill="#1E3B70"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Donut */}
        <div className="flex-1 bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] min-w-[30%] min-h-0">
          <h4 className="inter text-[clamp(12px,1.6vh,24px)] font-semibold text-gray-900 leading-none tracking-normal mb-[clamp(8px,1vh,20px)] shrink-0">
            Leads by Asset Category
          </h4>
          <div className="flex-1 flex items-center justify-center gap-[clamp(8px,1.5vh,32px)] lg:gap-[clamp(16px,3vh,60px)] min-h-0 pl-[clamp(4px,0.5vh,12px)] pr-[clamp(8px,1vh,24px)]">
            <div className="w-[clamp(80px,12vh,240px)] md:w-[clamp(100px,14vh,280px)] lg:w-[clamp(120px,20vh,360px)] aspect-square flex items-center justify-center relative shrink-0">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full transform -rotate-90 overflow-visible"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="14"
                />
                {(() => {
                  const items = data?.analytics?.leadsByCategory || [];
                  const total = items.reduce((s, i) => s + i.count, 0) || 1;
                  const colors = ["#D48D2A", "#1E3B70", "#10B981", "#9CA3AF"];
                  let cumulativeOffset = 0;
                  return items.map((item, idx) => {
                    const pct = item.count / total;
                    const dashArray = 238.7;
                    const offset = cumulativeOffset;
                    cumulativeOffset += pct;
                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke={colors[idx]}
                        strokeWidth="14"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashArray * (1 - pct)}
                        style={{
                          transform: `rotate(${offset * 360}deg)`,
                          transformOrigin: "center",
                        }}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-[clamp(2px,0.2vh,8px)]">
                <span className="text-[clamp(14px,2.4vh,40px)] font-bold text-gray-900 leading-none kaisei">
                  {data?.stats?.totalLeads || 0}
                </span>
                <span className="inter text-[clamp(8px,0.9vh,16px)] capitalize text-gray-500 font-semibold tracking-wide mt-[clamp(2px,0.3vh,8px)] lg:mt-[clamp(4px,0.5vh,12px)]">
                  Total Leads
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-[clamp(7.5px,1vh,20px)] lg:gap-[clamp(10px,1.5vh,30px)] w-[clamp(100px,12.5vh,200px)] lg:w-[clamp(150px,20vh,300px)]">
              {(data?.analytics?.leadsByCategory || []).map((r, i) => {
                const colors = ["#D48D2A", "#1E3B70", "#10B981", "#9CA3AF"];
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between inter text-[clamp(10.6px,1.27vh,21.25px)] font-bold text-gray-600"
                  >
                    <span className="flex items-center gap-[clamp(5px,0.625vh,15px)] lg:gap-[clamp(7.5px,1vh,22.5px)] truncate">
                      <span
                        className="w-[clamp(7.5px,1.25vh,20px)] h-[clamp(7.5px,1.25vh,20px)] rounded-full shrink-0"
                        style={{ backgroundColor: colors[i] }}
                      ></span>
                      {r.label}
                    </span>
                    <span className="text-gray-900 truncate pl-[clamp(5px,0.625vh,15px)] flex gap-[clamp(5px,0.625vh,15px)]">
                      <span className="w-[clamp(20px,2.5vh,40px)] text-right">
                        {r.count}
                      </span>{" "}
                      <span className="text-gray-400 font-medium w-[clamp(37.5px,5vh,100px)] lg:w-[clamp(50px,7.5vh,125px)] text-right">
                        ({r.p})
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end pt-[clamp(2px,0.2vh,8px)] shrink-0">
            <button
              onClick={() => setActiveTab("analytics")}
              className="inter text-[clamp(10px,1.2vh,18px)] font-semibold text-[#D48D2A] hover:text-[#B37622] transition-colors flex items-center gap-[clamp(4px,0.5vh,12px)] tracking-normal"
            >
              View Full Report{" "}
              <FiArrowRight className="text-[clamp(10px,1.1vh,18px)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="flex flex-col lg:flex-row gap-[clamp(8px,1vh,20px)] flex-none lg:flex-[1.1] min-h-0">
        {/* Top Assets Table */}
        <div className="flex-[1.2] min-h-0 bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex justify-between items-center mb-[clamp(8px,1vh,16px)]">
            <h4 className="inter text-[clamp(12px,1.6vh,24px)] font-bold text-gray-900 leading-none tracking-normal">
              Top Performing Assets
            </h4>
            <button
              onClick={() => setActiveTab("inventory")}
              className="inter text-[clamp(9px,1.2vh,16px)] font-normal text-[#D48D2A] hover:opacity-80 transition-opacity leading-none tracking-normal"
            >
              View all
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <table className="w-full text-left table-fixed">
              <thead className="sticky top-0 bg-white z-10 w-full">
                <tr>
                  <th className="pb-[clamp(4px,0.6vh,12px)] inter text-[clamp(9px,1.1vh,16px)] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 w-7/12">
                    Asset
                  </th>
                  <th className="pb-[clamp(4px,0.6vh,12px)] inter text-[clamp(9px,1.1vh,16px)] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 w-2/12 text-center">
                    Views
                  </th>
                  <th className="pb-[clamp(4px,0.6vh,12px)] inter text-[clamp(9px,1.1vh,16px)] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 w-3/12 text-right">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[clamp(10px,1.3vh,18px)] font-bold text-gray-600">
                {(data?.stats?.topAssets || []).slice(0, 3).map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-[clamp(6px,1.2vh,20px)] flex items-center gap-[clamp(6px,0.8vh,16px)] truncate">
                      <div className="w-[clamp(28px,4vh,60px)] h-[clamp(18px,2.5vh,40px)] rounded-[clamp(4px,0.6vh,12px)] bg-[#F3EBE3] shrink-0 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                            Image
                          </div>
                        )}
                      </div>
                      <span className="inter text-gray-900 truncate overflow-hidden whitespace-nowrap text-[clamp(10px,1.3vh,18px)] font-medium leading-none tracking-normal">
                        {item.name}
                      </span>
                    </td>
                    <td className="py-[clamp(6px,1.2vh,20px)] text-center text-gray-700 font-medium text-[clamp(10px,1.3vh,18px)] kaisei leading-none tracking-normal">
                      {numberWithCommas(item.views || 0)}
                    </td>
                    <td
                      className={`py-[clamp(6px,1.2vh,20px)] text-right font-medium tracking-tight inter text-[clamp(10px,1.3vh,18px)] ${item.change.includes("-") ? "text-red-500" : "text-[#10B981]"}`}
                    >
                      {!item.change.includes("-") && (
                        <span className="mr-1">↑</span>
                      )}
                      {item.change.startsWith("+")
                        ? item.change
                        : item.change.includes("-")
                          ? item.change
                          : `+${item.change}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leads Source Donut */}
        <div className="flex-1 min-w-0 bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden min-h-0">
          <div className="flex justify-between items-center mb-[clamp(4px,0.5vh,12px)] shrink-0">
            <h4 className="inter text-[clamp(12px,1.6vh,24px)] font-semibold text-gray-900 leading-none tracking-normal">
              Leads Source
            </h4>
            <button
              onClick={() => setActiveTab("analytics")}
              className="inter text-[clamp(9px,1.2vh,16px)] font-normal text-[#D48D2A] hover:opacity-80 transition-opacity leading-none tracking-normal"
            >
              View all
            </button>
          </div>
          <div className="flex-1 flex items-center justify-between z-10 px-0 mt-[clamp(2px,0.3vh,8px)] min-h-0">
            <div className="w-[clamp(80px,12vh,240px)] md:w-[clamp(100px,14vh,280px)] lg:w-[clamp(120px,18vh,360px)] aspect-square flex items-center justify-center relative shrink-0 -ml-[clamp(4px,0.5vh,12px)] lg:-ml-[clamp(8px,1vh,24px)]">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full transform -rotate-90 overflow-visible"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="20"
                />
                {(() => {
                  const items = data?.analytics?.leadsBySource || [];
                  const colors = ["#D48D2A", "#1E3B70", "#10B981", "#8B5CF6"];
                  const total = items.reduce((s, i) => s + i.count, 0) || 1;
                  let cumulativeOffset = 0;
                  return items.map((item, idx) => {
                    const pct = item.count / total;
                    const dashArray = 219.9;
                    const offset = cumulativeOffset;
                    cumulativeOffset += pct;
                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke={colors[idx]}
                        strokeWidth="20"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashArray * (1 - pct)}
                        style={{
                          transform: `rotate(${offset * 360}deg)`,
                          transformOrigin: "center",
                        }}
                      />
                    );
                  });
                })()}
              </svg>
            </div>
            <div className="w-1/2 flex flex-col justify-center gap-[clamp(7.5px,1vh,20px)] lg:gap-[clamp(10px,1.5vh,30px)] pl-[clamp(10px,1.25vh,25px)] z-10 pb-[0.5vh]">
              {(data?.analytics?.leadsBySource || []).map((r, i) => {
                const colors = ["#D48D2A", "#1E3B70", "#10B981", "#8B5CF6"];
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between text-[clamp(10.6px,1.27vh,21.25px)] font-bold text-gray-600 w-full lg:w-[clamp(125px,17.5vh,275px)]"
                  >
                    <span
                      className="flex items-center gap-[clamp(5px,0.625vh,15px)] lg:gap-[clamp(7.5px,1vh,22.5px)] truncate mr-[0.5vh]"
                      title={r.label}
                    >
                      <span
                        className="w-[clamp(7.5px,1.25vh,20px)] h-[clamp(7.5px,1.25vh,20px)] rounded-full shrink-0"
                        style={{ backgroundColor: colors[i] }}
                      ></span>
                      <span className="truncate inter font-semibold">
                        {r.label}
                      </span>
                    </span>
                    <span className="text-gray-900 text-right flex shrink-0 whitespace-nowrap">
                      <span className="w-[clamp(15px,1.875vh,40px)] inter font-semibold">
                        {r.count}
                      </span>{" "}
                      <span className="text-gray-400 font-medium w-[clamp(37.5px,5vh,100px)] lg:w-[clamp(50px,7.5vh,125px)] tracking-tight text-right inter">
                        ({r.p})
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conversion Rate Bars */}
        <div className="flex-[1.2] min-w-0 bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden min-h-0">
          <div className="flex justify-between items-start mb-[clamp(4px,0.5vh,12px)] shrink-0">
            <div className="flex flex-col">
              <h4 className="inter text-[clamp(12px,1.6vh,24px)] font-semibold text-gray-900 leading-none tracking-normal">
                Conversion Rate
              </h4>
              <span className="text-[20px] font-bold text-gray-900 mt-[clamp(2px,0.3vh,8px)] tracking-tight leading-none kaisei">
                {data?.stats?.avgConversion || "0.00"}%
              </span>
              <span
                className={`inter text-[clamp(8px,1.1vh,16px)] font-bold ${Number(data?.stats?.trends?.leads?.change) >= 0 ? "text-emerald-500" : "text-red-500"} mt-[clamp(2px,0.3vh,8px)] flex items-center gap-[clamp(2px,0.3vh,6px)]`}
              >
                {Number(data?.stats?.trends?.leads?.change) >= 0 ? (
                  <FiTrendingUp className="text-[clamp(10px,1.3vh,18px)]" />
                ) : (
                  <FiTrendingDown className="text-[clamp(10px,1.3vh,18px)]" />
                )}
                {Math.abs(data?.stats?.trends?.leads?.change || 0)}%
                <span className="inter text-gray-400 font-medium hidden sm:inline">
                  vs last 30 days
                </span>
              </span>
            </div>
            <div className="relative">
              <select
                value={convInterval}
                onChange={(e) => setConvInterval(e.target.value)}
                className="inter text-[clamp(8px,1.1vh,15px)] font-normal text-gray-600 bg-white border border-gray-100 rounded-[clamp(4px,0.6vh,10px)] pl-[clamp(4px,0.6vh,12px)] pr-[clamp(16px,2.2vh,32px)] py-[clamp(2px,0.3vh,6px)] outline-none shadow-sm cursor-pointer hover:bg-gray-50 leading-none tracking-normal appearance-none"
              >
                <option value="Day">Day</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
              </select>
              <FiChevronDown className="absolute right-[clamp(4px,0.6vh,10px)] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[clamp(8px,1.1vh,15px)]" />
            </div>
          </div>

          <div className="flex-1 flex flex-col mt-[clamp(4px,0.5vh,12px)] relative min-h-0">
            <div className="absolute inset-0 pb-[clamp(12px,1.8vh,32px)] pl-[clamp(24px,3.5vh,64px)] flex flex-col justify-between border-b border-gray-50 pointer-events-none pr-[clamp(4px,0.5vh,12px)]">
              {[100, 75, 50, 25, 0].map((val, i) => (
                <div
                  key={i}
                  className="w-full border-t border-gray-50 flex items-center h-0 relative"
                >
                  <span className="absolute -left-[clamp(24px,3.5vh,64px)] inter text-[clamp(8px,1.1vh,15px)] text-gray-400 font-normal w-[clamp(20px,3vh,56px)] text-right bg-white leading-none tracking-normal z-10">
                    {val}%
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 pl-[clamp(24px,3.5vh,64px)] pr-[clamp(4px,0.5vh,12px)] h-[clamp(12px,1.8vh,32px)] flex justify-between items-end inter text-[clamp(7px,0.9vh,14px)] font-normal text-gray-400 pb-[clamp(2px,0.3vh,6px)] tracking-normal leading-none z-20">
              {(() => {
                const rawData = (data?.stats?.dailyTrends || []).slice(
                  convInterval === "Day"
                    ? -3
                    : convInterval === "Week"
                      ? -7
                      : -30,
                );
                const trendData = [];
                if (rawData.length > 0) {
                  for (let i = 0; i < 10; i++) {
                    const idx = Math.min(
                      Math.floor((i / 9) * (rawData.length - 1)),
                      rawData.length - 1,
                    );
                    trendData.push(rawData[idx]);
                  }
                }
                return trendData
                  .filter((_, i) => i === 0 || i === 5 || i === 9)
                  .map((d, i) => (
                    <span key={i} className="whitespace-nowrap">
                      {new Date(d.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  ));
              })()}
            </div>

            <div className="flex-1 flex justify-between items-end h-full ml-[clamp(24px,3.5vh,64px)] pb-[clamp(12px,1.8vh,32px)] pt-[clamp(8px,1vh,20px)] relative z-10 gap-[clamp(2px,0.4vh,12px)]">
              {(() => {
                const rawData = (data?.stats?.dailyTrends || []).slice(
                  convInterval === "Day"
                    ? -3
                    : convInterval === "Week"
                      ? -7
                      : -30,
                );
                const trendData = [];
                if (rawData.length > 0) {
                  for (let i = 0; i < 10; i++) {
                    const idx = Math.min(
                      Math.floor((i / 9) * (rawData.length - 1)),
                      rawData.length - 1,
                    );
                    trendData.push(rawData[idx]);
                  }
                }

                if (trendData.length === 0)
                  return (
                    <div className="flex-1 h-full flex items-center justify-center text-gray-300 inter text-[clamp(10px,1.4vh,20px)]">
                      No trend data
                    </div>
                  );

                return trendData.map((d, i) => {
                  const conv = d.views > 0 ? (d.leads / d.views) * 100 : 0;
                  const h = Math.min(Math.max((conv / 100) * 100, 2), 100);
                  const isLast = i === trendData.length - 1;
                  const isHighlighted = isLast || i === 5 || i === 2;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end h-full group cursor-default relative"
                    >
                      {isHighlighted && (
                        <div className="absolute -top-[clamp(12px,1.8vh,32px)] bg-gray-900 text-white inter text-[clamp(6px,0.8vh,12px)] px-[clamp(4px,0.6vh,10px)] py-[clamp(1px,0.2vh,4px)] rounded-[clamp(2px,0.3vh,6px)] font-bold shadow-md z-20 whitespace-nowrap">
                          {conv.toFixed(1)}%
                        </div>
                      )}
                      <div
                        className={`w-[clamp(12px,1.8vh,36px)] rounded-t-[clamp(2px,0.3vh,6px)] transition-all duration-300 ${isLast ? "bg-[#D48D2A]" : "bg-[#FFF8F0] hover:bg-[#F2E8DB]"}`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Row: Recent Activity & Assets Overview */}
      <div className="flex flex-col lg:flex-row gap-[clamp(8px,1vh,20px)] flex-none lg:flex-[0.7] min-h-0">
        <div className="flex-1 bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] justify-between relative overflow-hidden min-h-0">
          <div className="flex justify-between items-center mb-[clamp(4px,0.5vh,12px)]">
            <h4 className="inter text-[clamp(12px,1.6vh,24px)] font-semibold text-gray-900 leading-none tracking-normal">
              Recent Activity
            </h4>
            <button
              onClick={() => setActiveTab("inventory")}
              className="inter text-[clamp(9px,1.2vh,16px)] font-normal text-[#D48D2A] hover:opacity-80 transition-opacity leading-none tracking-normal"
            >
              View all
            </button>
          </div>
          <div className="space-y-[clamp(4px,0.6vh,12px)] flex-1 overflow-auto custom-scrollbar mt-[clamp(4px,0.5vh,12px)]">
            {(data?.notifications || []).slice(0, 3).map((notif, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-[clamp(9px,1.2vh,16px)] group hover:bg-gray-50 px-[clamp(4px,0.5vh,12px)] py-[clamp(4px,0.5vh,10px)] rounded-[clamp(4px,0.5vh,10px)] transition-colors"
              >
                <div className="flex items-center gap-[clamp(6px,0.8vh,16px)] text-gray-600 truncate">
                  <FiActivity className="text-[#D48D2A] shrink-0 text-[clamp(10px,1.4vh,20px)]" />
                  <span className="font-normal text-gray-800 truncate inter">
                    {notif.message}
                  </span>
                </div>
                <span className="text-gray-400 font-normal inter shrink-0 ml-[clamp(8px,1vh,20px)]">
                  {new Date(notif.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[1.8] min-w-0 bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(10px,1.5vh,24px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] justify-between relative overflow-hidden min-h-0">
          <div className="flex justify-between items-center mb-[clamp(4px,0.5vh,12px)]">
            <h4 className="inter text-[clamp(12px,1.6vh,24px)] font-semibold text-gray-900 leading-none tracking-normal">
              Assets Overview
            </h4>
            <button
              onClick={() => setActiveTab("inventory")}
              className="inter text-[clamp(9px,1.2vh,16px)] font-normal text-[#D48D2A] hover:opacity-80 transition-opacity leading-none tracking-normal"
            >
              Manage Assets
            </button>
          </div>
          <div className="flex justify-between items-start mt-[clamp(8px,1.5vh,24px)] px-[clamp(8px,1vh,24px)] pb-[clamp(4px,0.5vh,12px)]">
            <div className="flex flex-col text-left flex-1 border-r border-gray-100 pr-[clamp(8px,1.5vh,24px)]">
              <span className="inter text-[clamp(7px,0.9vh,14px)] font-black uppercase tracking-[0.08em] text-gray-700 mb-[clamp(2px,0.3vh,8px)] whitespace-nowrap">
                Total Assets
              </span>
              <span className="text-[clamp(18px,2.8vh,48px)] font-bold text-gray-900 leading-none kaisei">
                {data?.stats?.totalAssets || 0}
              </span>
              <span className="inter text-[clamp(8px,1.1vh,16px)] font-bold text-emerald-500 flex items-center gap-[clamp(2px,0.3vh,6px)] mt-[clamp(4px,0.6vh,12px)] tracking-tight">
                <FiTrendingUp className="text-[clamp(9px,1.2vh,18px)]" />{" "}
                {data?.stats?.trends?.views?.current > 0 ? "Active" : "Idle"}
              </span>
            </div>
            <div className="flex flex-col text-left flex-1 pl-[clamp(12px,2vh,32px)] border-r border-gray-100 pr-[clamp(8px,1.5vh,24px)]">
              <span className="inter text-[clamp(7px,0.9vh,14px)] font-black uppercase tracking-[0.08em] text-gray-700 mb-[clamp(2px,0.3vh,8px)] whitespace-nowrap">
                Live Assets
              </span>
              <span className="text-[clamp(18px,2.8vh,48px)] font-bold text-gray-900 leading-none mt-[clamp(4px,0.6vh,12px)] kaisei">
                {data?.stats?.activeCount || 0}
              </span>
              <div className="w-[clamp(6px,1vh,12px)] h-[clamp(6px,1vh,12px)] rounded-full bg-emerald-500 mt-[clamp(8px,1.5vh,24px)] shadow-sm shadow-emerald-500/20"></div>
            </div>
            <div className="flex flex-col text-left flex-[0.8] pl-[clamp(12px,2vh,32px)] border-r border-gray-100 pr-[clamp(8px,1.5vh,24px)]">
              <span className="inter text-[clamp(7px,0.9vh,14px)] font-black uppercase tracking-[0.08em] text-gray-700 mb-[clamp(2px,0.3vh,8px)]">
                Drafts
              </span>
              <span className="text-[clamp(18px,2.8vh,48px)] font-bold text-gray-900 leading-none mt-[clamp(4px,0.6vh,12px)] kaisei">
                0
              </span>
              <div className="w-[clamp(6px,1vh,12px)] h-[clamp(6px,1vh,12px)] rounded-full bg-[#D48D2A] mt-[clamp(8px,1.5vh,24px)] shadow-sm shadow-[#D48D2A]/20"></div>
            </div>
            <div className="flex flex-col text-left flex-[0.8] pl-[clamp(12px,2vh,32px)]">
              <span className="inter text-[clamp(7px,0.9vh,14px)] font-black uppercase tracking-[0.08em] text-gray-700 mb-[clamp(2px,0.3vh,8px)]">
                Sold
              </span>
              <span className="text-[clamp(18px,2.8vh,48px)] font-bold text-gray-900 leading-none mt-[clamp(4px,0.6vh,12px)] kaisei">
                {data?.stats?.closedCount || 0}
              </span>
              <div className="w-[clamp(6px,1vh,12px)] h-[clamp(6px,1vh,12px)] rounded-full bg-gray-300 mt-[clamp(8px,1.5vh,24px)] border border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
