import { Trash2 } from 'lucide-react';
import Image from 'next/image';

type AddressCardProps = {
  title?: string;
  showDelete?: boolean;
  onDeleteClick?: () => void;
  showProfileImage?: boolean;
  user?: {
    name: string;
    addressLine: string;
    email: string;
    secEmail?: string;
    phone: string;
    imageUrl?: string;
  };
  onEditClick?: () => void;
};

export default function BillingAddress({
  title = 'Billing Address',
  showDelete = false,
  onDeleteClick,
  showProfileImage = false,
  user,
  onEditClick
}: AddressCardProps) {
  return (
    <div className="border border-gray-300 rounded bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium text-black uppercase">{title}</h4>
        {showDelete && (
          <button onClick={onDeleteClick} className="text-red-500 hover:text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <hr className="border-b border-gray-300" />

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {showProfileImage && user?.imageUrl && (
            <Image
              src={user.imageUrl}
              alt={user.name}
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.addressLine}</p>
          </div>
        </div>

        <div className="mt-3 space-y-1 text-sm">
          {user?.email && (
            <p className="text-black">
              Email: <a href={`mailto:${user.email}`} className="text-gray-400">{user.email}</a>
            </p>
          )}
          {user?.secEmail && (
            <p className="text-black">
              Sec Email: <a href={`mailto:${user.secEmail}`} className="text-gray-400">{user.secEmail}</a>
            </p>
          )}
          {user?.phone && (
            <p className="text-black">
              Phone: <a href={`tel:${user.phone}`} className="text-gray-400">{user.phone}</a>
            </p>
          )}
        </div>

        <button
          onClick={onEditClick}
          className="mt-4 text-sm border border-yellow-500 text-yellow-500 hover:bg-yellow-50 px-4 py-3 rounded cursor-pointer"
        >
          EDIT ADDRESS
        </button>
      </div>
    </div>
  );
}
