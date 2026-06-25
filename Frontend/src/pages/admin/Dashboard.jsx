import { Package, Tags, FileText, MessageSquare, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useState, useEffect } from "react"
import api from "@/services/axios"

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function TrendBadge({ trend }) {
  if (trend === null || trend === undefined) return null
  if (trend === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-semibold">
        <Minus className="h-3 w-3" /> 0%
      </span>
    )
  }
  if (trend > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded font-semibold">
        <TrendingUp className="h-3 w-3" /> +{trend}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded font-semibold">
      <TrendingDown className="h-3 w-3" /> {trend}%
    </span>
  )
}

export default function Dashboard() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalArticles: 0,
    totalMessages: 0,
    productTrend: [],
    categoryDistribution: [],
    recentActivity: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setDashboardStats(res.data);
      } catch (err) {
        console.error("Gagal memuat statistik", err);
      }
    };
    fetchStats();
  }, []);

  const dynamicStats = [
    {
      title: "Total Produk",
      value: dashboardStats.totalProducts,
      icon: Package,
      trend: null,
      sub: "item tersedia",
    },
    {
      title: "Kategori",
      value: dashboardStats.totalCategories,
      icon: Tags,
      trend: null,
      sub: "kategori terdaftar",
    },
    {
      title: "Artikel",
      value: dashboardStats.totalArticles,
      icon: FileText,
      trend: null,
      sub: "artikel/berita",
    },
    {
      title: "Pesan Masuk",
      value: dashboardStats.totalMessages,
      icon: MessageSquare,
      trend: null,
      sub: "pesan dari pengunjung",
    },
  ];

  // Dark-mode specific values for Recharts
  const gridColor = isDark ? "#1e293b" : "#f1f5f9"
  const textLabelColor = isDark ? "#64748b" : "#94a3b8"
  const tooltipBg = isDark ? "#0f172a" : "#ffffff"
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0"
  const chartLineColor = isDark ? "#60a5fa" : "#2563EB"

  const areaData = dashboardStats.productTrend || [];

  const baseColors = [
    { dark: "#38bdf8", light: "#0F172A" },
    { dark: "#60a5fa", light: "#2563EB" },
    { dark: "#34d399", light: "#10b981" },
    { dark: "#a78bfa", light: "#7c3aed" },
    { dark: "#fb7185", light: "#e11d48" },
    { dark: "#cbd5e1", light: "#94a3b8" },
  ];

  const pieData = (dashboardStats.categoryDistribution || []).map((item, index) => {
    const colorObj = baseColors[index % baseColors.length];
    return {
      name: item.name,
      value: item.value,
      color: isDark ? colorObj.dark : colorObj.light
    };
  });

  const totalCategoryProducts = pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 text-left">
      {/* Page Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">
            CV Globalindo Teknik Mandiri · Sistem Administrasi
          </p>
        </div>
        <div className="text-xs text-muted-foreground/60 font-semibold">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Summary Metrics - Glassmorphism is permitted here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStats.map((stat, i) => (
          <div
            key={i}
            className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-background/80 border border-border rounded-lg flex items-center justify-center shrink-0 shadow-card">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <TrendBadge trend={stat.trend} />
            </div>
            <div className="text-2xl font-extrabold text-foreground mb-0.5 tracking-tight">{stat.value}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{stat.title}</div>
            <div className="text-xs text-muted-foreground/60 font-medium mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Analytics Charts - Solid containers */}
      <div className="grid lg:grid-cols-3 gap-4">
        
        {/* Area Chart - Solid bg */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5 text-left">
            <div>
              <h2 className="font-bold text-foreground text-sm">Penambahan Produk (6 Bulan)</h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Tren pengisian katalog inventaris</p>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartLineColor} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={chartLineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: textLabelColor, fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: textLabelColor, fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: "8px",
                    border: `1px solid ${tooltipBorder}`,
                    color: isDark ? "#ffffff" : "#0f172a",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartLineColor}
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={{ fill: chartLineColor, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Solid bg */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="mb-5 text-left">
              <h2 className="font-bold text-foreground text-sm">Distribusi Kategori</h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Komposisi inventaris berdasarkan kategori</p>
            </div>
            <div className="h-[160px] flex items-center justify-center">
              {totalCategoryProducts > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-xs text-muted-foreground text-center">Belum ada data distribusi kategori</span>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-1.5 text-left max-h-[120px] overflow-y-auto pr-1">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground font-semibold">{item.name}</span>
                </div>
                <span className="font-bold text-foreground">
                  {item.value} ({totalCategoryProducts > 0 ? Math.round((item.value / totalCategoryProducts) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Table - Solid Container */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground text-sm">Aktivitas Terkini</h2>
          <button className="text-xs text-muted-foreground hover:text-accent font-bold transition-colors cursor-pointer">
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground border-b border-border">
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wide w-48">Pengguna</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wide">Aktivitas</th>
                <th className="text-right px-6 py-3 font-semibold text-xs uppercase tracking-wide w-36">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(dashboardStats.recentActivity || []).length > 0 ? (
                (dashboardStats.recentActivity || []).map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 select-none">
                          {row.initials}
                        </div>
                        <span className="font-semibold text-foreground text-sm whitespace-nowrap">{row.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground text-sm max-w-xs md:max-w-md">
                      <p className="line-clamp-1">{row.activity}</p>
                    </td>
                    <td className="px-6 py-3.5 text-right text-muted-foreground/60 text-xs font-semibold whitespace-nowrap">
                      {formatRelativeTime(row.time)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground text-xs font-medium">
                    Belum ada aktivitas tercatat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
