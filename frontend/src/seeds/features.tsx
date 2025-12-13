import {
  Bell,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Code,
  Database,
  Shield,
  Users,
  Zap,
} from "lucide-react";

export const features = [
  {
    icon: CheckCircle2,
    title: "Gestion de Tâches",
    description: "Organisez vos tâches avec simplicité et efficacité",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Travaillez en équipe sur vos projets",
  },
  {
    icon: Calendar,
    title: "Planning",
    description: "Planifiez et suivez vos échéances",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Recevez des rappels personnalisés",
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "Vos données sont protégées",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Interface rapide et réactive",
  },
  {
    icon: Shield,
    title: "Authentification Sécurisée",
    description:
      "JWT pour une sécurité robuste avec inscription, connexion et protection des routes par middleware.",
    color: "bg-blue-600",
  },
  {
    icon: Users,
    title: "Collaboration en Équipe",
    description:
      "Gestion collaborative des tâches avec système de rooms et ajout de membres en temps réel.",
    color: "bg-purple-600",
  },
  {
    icon: CheckCircle,
    title: "CRUD Complet",
    description:
      "Création, lecture, mise à jour et suppression de tâches avec gestion des priorités et statuts.",
    color: "bg-green-600",
  },
  {
    icon: Zap,
    title: "Performance Optimisée",
    description:
      "Construite avec Fastify pour des performances exceptionnelles et une scalabilité maximale.",
    color: "bg-yellow-600",
  },
  {
    icon: Database,
    title: "Base de Données Robuste",
    description:
      "MongoDB pour une gestion flexible des données avec support cloud via Atlas.",
    color: "bg-red-600",
  },
  {
    icon: Code,
    title: "Interface Moderne",
    description:
      "UI responsive avec loaders, notifications toast et navigation intuitive pour une UX optimale.",
    color: "bg-indigo-600",
  },
];
