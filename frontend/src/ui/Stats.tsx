import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import type { Task } from "../types/task";

const Stats = ({ tasks }: { tasks: Task[] }) => {
  // Données d'exemple
  const stats = [
    {
      label: "Total",
      value: tasks.length,
      icon: Clock,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Complétées",
      value: tasks.filter((t) => t.completed).length,
      icon: CheckCircle2,
      color: "from-green-500 to-green-600",
    },
    {
      label: "En cours",
      value: tasks.filter((t) => t.status === "in_progress").length,
      icon: TrendingUp,
      color: "from-yellow-400 to-yellow-500",
    },
    {
      label: "Urgentes",
      value: tasks.filter((t) => t.priority === "high").length,
      icon: AlertCircle,
      color: "from-red-500 to-red-600",
    },
    {
      label: "Très Urgentes",
      value: tasks.filter((t) => t.priority === "critical").length,
      icon: AlertCircle,
      color: "from-red-700 to-red-900",
    },
  ];

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-extrabold text-slate-400 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                style={{
                  width: `${Math.min(
                    (stat.value / (tasks.length || 1)) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Stats;
