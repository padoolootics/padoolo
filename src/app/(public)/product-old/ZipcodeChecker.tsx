import { useState, KeyboardEvent } from 'react';

interface ZipCodeCheckerProps {
  onAvailabilityChange?: (isAvailable: boolean, data: ApiResponse) => void;
}

interface ApiResponse {
  available: boolean;
  message: string;
  zone_name?: string;
  country?: string;
  error?: string;
}

const ZipCodeChecker = ({ onAvailabilityChange }: ZipCodeCheckerProps) => {
  const [zipcode, setZipcode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [zoneName, setZoneName] = useState<string>('');

  const checkZipcode = async (): Promise<void> => {
    if (!zipcode.trim()) {
      setMessage('Please enter a zipcode');
      setIsAvailable(false);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsAvailable(null);
    setZoneName('');

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/custom/v1/check-zipcode`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zipcode: zipcode.trim() }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      setIsAvailable(data.available);
      setMessage(data.message);
      setZoneName(data.zone_name || '');

      // Call callback if provided
      if (onAvailabilityChange) {
        onAvailabilityChange(data.available, data);
      }

    } catch (error) {
      console.error('Error checking zipcode:', error);
      setIsAvailable(false);
      setMessage('Unable to check delivery availability. Please try again later.');
      
      if (onAvailabilityChange) {
        const errorData: ApiResponse = { 
          available: false, 
          message: 'Unable to check delivery availability. Please try again later.',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        onAvailabilityChange(false, errorData);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      checkZipcode();
    }
  };

  const clearResults = (): void => {
    setMessage('');
    setIsAvailable(null);
    setZoneName('');
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-2">
          Check Delivery Availability
        </label>
        <div className="flex border border-gray-300 overflow-hidden rounded-lg shadow-sm">
          <input
            id="zipcode"
            type="text"
            placeholder="Enter your zipcode (e.g., D02 X285)"
            className="px-3 py-2 text-sm outline-none w-full focus:ring-2 focus:ring-[#D99E46] focus:border-transparent"
            value={zipcode}
            onChange={(e) => {
              setZipcode(e.target.value);
              if (message) clearResults();
            }}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button
            className="bg-[#D99E46] text-white px-6 py-2 hover:bg-yellow-700 transition disabled:bg-[#D99E46] disabled:cursor-not-allowed cursor-pointer"
            onClick={checkZipcode}
            disabled={loading || !zipcode.trim()}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                <span>...</span>
              </div>
            ) : (
              'Check'
            )}
          </button>
        </div>
      </div>

      {/* Results Display */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            isAvailable
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          } ${isAvailable === null ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : ''}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {isAvailable ? (
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message}</p>
              {zoneName && (
                <p className="text-sm mt-1 opacity-80">Zone: {zoneName}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZipCodeChecker;