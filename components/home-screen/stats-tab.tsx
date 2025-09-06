import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Payment, Booking } from '@/types';

interface StatsTabProps {
  payments: Payment[];
  bookings: Booking[];
}

const StatsTab: React.FC<StatsTabProps> = ({ payments, bookings }) => {
  // Préparer les données pour les graphiques
  const monthlyData = [
    { month: 'Jan', dépenses: 780000, réservations: 5 },
    { month: 'Fév', dépenses: 1170000, réservations: 8 },
    { month: 'Mar', dépenses: 975000, réservations: 6 },
    { month: 'Avr', dépenses: 1430000, réservations: 10 },
    { month: 'Mai', dépenses: 1560000, réservations: 12 },
    { month: 'Juin', dépenses: 1365000, réservations: 9 },
  ];

  const statusData = [
    { name: 'Confirmées', value: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'En attente', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'Annulées', value: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const COLORS = ['#4caf50', '#ff9800', '#f44336'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistiques de dépenses</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Dépenses mensuelles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => [`${value.toLocaleString()} FCFA`, 'Dépenses']} />
              <Legend />
              <Bar dataKey="dépenses" fill="#ff7b00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Évolution des réservations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="réservations" stroke="#ff7b00" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Statut des réservations</h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;