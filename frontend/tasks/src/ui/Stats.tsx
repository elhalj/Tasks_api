import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";


const Stats = () => {
     // Données d'exemple
  const stats = [
    { label: 'Total', value: 24, icon: Clock, color: 'bg-blue-500' },
    { label: 'Complétées', value: 12, icon: CheckCircle2, color: 'bg-green-500' },
    { label: 'En cours', value: 8, icon: TrendingUp, color: 'bg-yellow-500' },
    { label: 'Urgentes', value: 4, icon: AlertCircle, color: 'bg-red-500' }
  ];
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Stats
