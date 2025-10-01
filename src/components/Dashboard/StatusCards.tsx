import { RocketIcon, FileTextIcon, PackageIcon } from "lucide-react";

type StatusCardsProps = {
  total: number;
  pending: number;
  completed: number;
};

export default function OrderStatusCards({ total, pending, completed }: StatusCardsProps) {
  const orderStats = [
    {
      icon: RocketIcon,
      count: total,
      label: "Total Orders",
      color: "blue",
    },
    {
      icon: FileTextIcon,
      count: pending,
      label: "Pending Orders",
      color: "yellow",
    },
    {
      icon: PackageIcon,
      count: completed,
      label: "Completed Orders",
      color: "green",
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-5">
        {orderStats.map(({ icon: Icon, count, label, color }, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 rounded-md bg-${color}-50`}
          >
            <div className={`text-${color}-500 bg-white p-3`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">
                {String(count)}
              </p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
