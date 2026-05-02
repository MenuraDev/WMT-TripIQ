const HOST = '192.168.1.60';
const API_BASE_URL = `http://${HOST}:5000/api/vehicles`;

export interface Vehicle {
  _id?: string;
  driverId?: string;
  type: string;
  capacity: number;
  pricePerKm: number;
  condition: string;
}

export const vehicleAPI = {
  addVehicle: async (vehicleData: Vehicle, token: string) => {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add vehicle');
    }

    return response.json();
  },

  getDriverVehicles: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch vehicles');
    }

    return response.json();
  },
};
