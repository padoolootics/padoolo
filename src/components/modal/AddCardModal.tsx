'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type AddCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                leave="ease-in duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            leave="ease-in duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-0 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title className="text-lg font-medium text-gray-900 p-4 border-b border-gray-300">
                                    ADD NEW CARD
                                </Dialog.Title>

                                <div className="mt-4 space-y-6 p-4 text-sm text-gray-700">
                                    <div>
                                        <label htmlFor="cardName" className="block mb-1 font-medium">Name on Card</label>
                                        <input
                                        id="cardName"
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="cardNumber" className="block mb-1 font-medium">Card Number</label>
                                        <input
                                        id="cardNumber"
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="w-1/2">
                                            <label htmlFor="expiry" className="block mb-1 font-medium">Expire Date</label>
                                            <input
                                                id="expiry"
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label htmlFor="cvc" className="block mb-1 font-medium">CVC</label>
                                            <input
                                                id="cvc"
                                                type="text"
                                                placeholder="123"
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6 flex items-center mb-4">
                                        <button
                                            onClick={onClose}
                                            className="w-1/2 bg-yellow-600 hover:bg-yellow-500 text-white font-normal py-2 rounded-sm transition cursor-pointer"
                                        >
                                            PUBLISH REVIEW
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="ml-4 text-sm text-gray-500 hover:underline cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
