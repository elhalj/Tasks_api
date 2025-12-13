import { Bell, Calendar, MessageSquare } from "lucide-react";

export const roadmapItems = [
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Notifications Push",
      description: "Alertes en temps réel pour les échéances et tâches importantes",
      color: "bg-blue-600"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Messagerie Privée",
      description: "Communication intégrée avec notifications de messages non lus",
      color: "bg-purple-600"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Calendrier Intégré",
      description: "Visualisation temporelle des tâches avec rappels personnalisables",
      color: "bg-green-600"
    }
  ];