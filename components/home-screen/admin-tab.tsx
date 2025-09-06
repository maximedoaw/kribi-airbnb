import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Apartment, Booking, Payment } from '@/types';

// Import des composants Shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface AdminTabProps {
  apartments?: Apartment[];
  bookings?: Booking[];
  payments?: Payment[];
}

const AdminTab: React.FC<AdminTabProps> = ({ 
  apartments = [], 
  bookings = [], 
  payments = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newApartment, setNewApartment] = useState<Partial<Apartment>>({
    title: '',
    description: '',
    price: 0,
    location: '',
    images: [],
    available: true,
    rating: 0
  });

  // Données fictives pour les démos
  const fakeApartments: Apartment[] = [
    {
      id: '1',
      title: 'Appartement Vue Mer Luxueux',
      description: 'Magnifique appartement avec vue imprenable sur la mer, proche du centre ville',
      price: 125000,
      location: 'Kribi, Littoral',
      images: ['/placeholder-apartment.jpg'],
      available: true,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Studio Moderne Élégant',
      description: 'Studio entièrement rénové avec équipements modernes et design contemporain',
      price: 75000,
      location: 'Douala, Bonanjo',
      images: ['/placeholder-apartment.jpg'],
      available: true,
      rating: 4.5
    },
    {
      id: '3',
      title: 'Duplex Luxueux avec Piscine',
      description: 'Spacieux duplex avec terrasse panoramique et piscine privative',
      price: 220000,
      location: 'Yaoundé, Bastos',
      images: ['/placeholder-apartment.jpg'],
      available: false,
      rating: 4.9
    },
    {
      id: '4',
      title: 'Appartement Familial Confortable',
      description: 'Grand appartement parfait pour les familles, proche des écoles et commodités',
      price: 95000,
      location: 'Bafoussam, Centre',
      images: ['/placeholder-apartment.jpg'],
      available: true,
      rating: 4.3
    },
    {
      id: '5',
      title: 'Studio Économique Fonctionnel',
      description: 'Studio fonctionnel à prix abordable dans quartier calme',
      price: 45000,
      location: 'Garoua, Nord',
      images: ['/placeholder-apartment.jpg'],
      available: true,
      rating: 4.0
    }
  ];

  const fakeBookings: Booking[] = [
    {
      id: '1',
      apartmentId: '1',
      userId: 'user1',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      status: 'confirmed',
      apartment: fakeApartments[0]
    },
    {
      id: '2',
      apartmentId: '2',
      userId: 'user2',
      startDate: '2024-01-18',
      endDate: '2024-01-25',
      status: 'pending',
      apartment: fakeApartments[1]
    },
    {
      id: '3',
      apartmentId: '3',
      userId: 'user3',
      startDate: '2024-02-01',
      endDate: '2024-02-10',
      status: 'cancelled',
      apartment: fakeApartments[2]
    },
    {
      id: '4',
      apartmentId: '4',
      userId: 'user4',
      startDate: '2024-01-22',
      endDate: '2024-01-28',
      status: 'confirmed',
      apartment: fakeApartments[3]
    },
    {
      id: '5',
      apartmentId: '5',
      userId: 'user5',
      startDate: '2024-02-05',
      endDate: '2024-02-12',
      status: 'pending',
      apartment: fakeApartments[4]
    }
  ];

  const fakePayments: Payment[] = [
    {
      id: 'pay1',
      userId: 'user1',
      amount: 625000,
      date: '2024-01-10',
      status: 'completed',
      bookingId: '1'
    },
    {
      id: 'pay2',
      userId: 'user2',
      amount: 375000,
      date: '2024-01-12',
      status: 'pending',
      bookingId: '2'
    },
    {
      id: 'pay3',
      userId: 'user3',
      amount: 1100000,
      date: '2024-01-20',
      status: 'failed',
      bookingId: '3'
    },
    {
      id: 'pay4',
      userId: 'user4',
      amount: 475000,
      date: '2024-01-18',
      status: 'completed',
      bookingId: '4'
    },
    {
      id: 'pay5',
      userId: 'user5',
      amount: 225000,
      date: '2024-01-25',
      status: 'pending',
      bookingId: '5'
    }
  ];

  // Utiliser les données fictives si les props sont vides
  const displayApartments = apartments.length > 0 ? apartments : fakeApartments;
  const displayBookings = bookings.length > 0 ? bookings : fakeBookings;
  const displayPayments = payments.length > 0 ? payments : fakePayments;

  // Données fictives pour les graphiques
  const revenueData = [
    { month: 'Jan', revenue: 2730000, bookings: 42, expenses: 1230000 },
    { month: 'Fév', revenue: 3770000, bookings: 58, expenses: 1450000 },
    { month: 'Mar', revenue: 3315000, bookings: 51, expenses: 1320000 },
    { month: 'Avr', revenue: 4680000, bookings: 72, expenses: 1560000 },
    { month: 'Mai', revenue: 5460000, bookings: 84, expenses: 1680000 },
    { month: 'Juin', revenue: 5915000, bookings: 91, expenses: 1720000 },
  ];

  const statusData = [
    { name: 'Confirmées', value: displayBookings.filter(b => b.status === 'confirmed').length },
    { name: 'En attente', value: displayBookings.filter(b => b.status === 'pending').length },
    { name: 'Annulées', value: displayBookings.filter(b => b.status === 'cancelled').length },
  ];

  const COLORS = ['#16a34a', '#ea580c', '#dc2626']; // Vert, Orange, Rouge

  // Calcul des statistiques
  const totalRevenue = displayPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const availableApartments = displayApartments.filter(a => a.available).length;
  const occupiedApartments = displayApartments.length - availableApartments;

  // Filtrage des données
  const filteredApartments = useMemo(() => {
    return displayApartments.filter(apartment => 
      apartment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apartment.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [displayApartments, searchTerm]);

  const filteredBookings = useMemo(() => {
    let result = displayBookings;
    
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    if (dateFilter !== 'all') {
      const now = new Date();
      if (dateFilter === 'today') {
        result = result.filter(booking => 
          new Date(booking.startDate).toDateString() === now.toDateString()
        );
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        result = result.filter(booking => 
          new Date(booking.startDate) >= weekAgo
        );
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        result = result.filter(booking => 
          new Date(booking.startDate) >= monthAgo
        );
      }
    }
    
    return result;
  }, [displayBookings, statusFilter, dateFilter]);

  const filteredPayments = useMemo(() => {
    let result = displayPayments;
    
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    return result;
  }, [displayPayments, statusFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Complété';
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const handleAddApartment = () => {
    // Ici, on ajouterait normalement l'appartement à la base de données
    console.log('Nouvel appartement:', newApartment);
    setIsAddDialogOpen(false);
    // Réinitialiser le formulaire
    setNewApartment({
      title: '',
      description: '',
      price: 0,
      location: '',
      images: [],
      available: true,
      rating: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Espace Administration
          </h2>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 极 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Ajouter un appartement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel appartement</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour ajouter un nouvel appartement à votre catalogue.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Titre
                  </Label>
                  <Input
                    id="title"
                    value={newApartment.title}
                    onChange={(e) => setNewApartment({...newApartment, title: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newApartment.description}
                    onChange={(e) => setNewApartment({...newApartment, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Prix (FCFA)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newApartment.price}
                    onChange={(e) => setNewApartment({...newApartment, price: Number(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Localisation
                  </Label>
                  <Input
                    id="location"
                    value={newApartment.location}
                    onChange={(e) => setNewApartment({...newApartment, location: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="available" className="text-right">
                    Disponible
                  </Label>
                  <div className="col-span-3">
                    <Switch
                      id="available"
                      checked={newApartment.available}
                      onCheckedChange={(checked) => setNewApartment({...newApartment, available: checked})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddApartment} className="bg-orange-600 hover:bg-orange-700">
                  Ajouter l'appartement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher appartements, réservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] md:w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px] md:w-[160px]">
                <SelectValue placeholder="Toutes les dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[500px] bg-blue-50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="apartments" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            Appartements
          </TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Réservations
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Paiements
          </TabsTrigger>
        </TabsList>
        
        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Revenu Total</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-blue-600">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 极 0 0 1 0 7H6" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800">{totalRevenue.toLocaleString()} FCFA</div>
                <p className="text-xs text-blue-600">+20.1% ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Appartements</CardTitle>
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-orange-600">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                    <path d="M12 3v6" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-800">{displayApartments.length}</div>
                <p className="text-xs text-orange-600">
                  {availableApartments} disponibles, {occupiedApartments} occupés
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Réservations</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-green-600">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 极.75" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">{displayBookings.length}</div>
                <p className="text-xs text-green-600">+18% ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Transactions</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-purple-600">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-800">{displayPayments.length}</div>
                <p className="text-xs text-purple-600">+12% ce mois-ci</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-blue-100">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="text-blue-800">Revenus et Dépenses Mensuels</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, '']} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Revenus" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Dépenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3 border-orange-100">
              <CardHeader className="bg-orange-50 rounded-t-lg">
                <CardTitle className="text-orange-800">Réservations par Statut</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          </div>

          <Card className="border-green-100">
            <CardHeader className="bg-green-50 rounded-t-lg">
              <CardTitle className="text-green-800">Évolution des Réservations</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#ea580c" 
                    strokeWidth={3} 
                    activeDot={{ r: 8, fill: '#ea580c' }} 
                    name="Réservations" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vue Appartements */}
        <TabsContent value="apartments">
          <Card className="border-orange-100">
            <CardHeader className="bg-orange-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-orange-800">Gestion des Appartements</CardTitle>
                  <CardDescription className="text-orange-600">
                    Liste de tous les appartements disponibles dans le système
                  </CardDescription>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-sm text-orange-700">
                    {filteredApartments.length} appartement(s) trouvé(s)
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-orange-50">
                    <TableRow>
                      <TableHead className="text-orange-800">Appartement</TableHead>
                      <TableHead className="text-orange-800">Localisation</TableHead>
                      <TableHead className="text-orange-800">Prix</TableHead>
                      <TableHead className="text-orange-800">Note</TableHead>
                      <TableHead className="text-orange-800">Statut</TableHead>
                      <TableHead className="text-right text-orange-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApartments.map((apartment) => (
                      <TableRow key={apartment.id} className="hover:bg-orange-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden border border-orange-200">
                              <img 
                                src={apartment.images[0] || '/placeholder-apartment.jpg'} 
                                alt={apartment.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{apartment.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {apartment.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{apartment.location}</TableCell>
                        <TableCell className="font-medium text-orange-700">{apartment.price.toLocaleString()} FCFA</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(apartment.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-sm text-muted-foreground">({apartment.rating})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={apartment.available ? "default" : "secondary"} 
                            className={apartment.available ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                          >
                            {apartment.available ? "Disponible" : "Indisponible"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2 border-blue-300 text-blue-700 hover:bg-blue-50">
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredApartments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucun appartement trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vue Réservations */}
        <TabsContent value="bookings">
          <Card className="border-green-100">
            <CardHeader className="bg-green-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-green-800">Gestion des Réservations</CardTitle>
                  <CardDescription className="text-green-600">
                    Liste de toutes les réservations en cours et passées
                  </CardDescription>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-sm text-green-700">
                    {filteredBookings.length} réservation(s) trouvée(s)
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-green-50">
                    <TableRow>
                      <TableHead className="text-green-800">Client</TableHead>
                      <TableHead className="text-green-800">Appartement</TableHead>
                      <TableHead className="text-green-800">Période</TableHead>
                      <TableHead className="text-green-800">Montant</TableHead>
                      <TableHead className="text-green-800">Statut</TableHead>
                      <TableHead className="text-right text-green-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-green-50/50">
                        <TableCell className="font-medium">User #{booking.userId.slice(0, 8)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{booking.apartment?.title}</div>
                            <div className="text-sm text-muted-foreground">{booking.apartment?.location}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium text-green-700">
                          {booking.apartment ? (booking.apartment.price * 3).toLocaleString() : '0'} FCFA
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(booking.status)} className={
                            booking.status === 'confirmed' ? "bg-green-100 text-green-800 hover:bg-green-100" :
                            booking.status === 'pending' ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                            "bg-red-100 text-red-800 hover:bg-red-100"
                          }>
                            {getStatusText(booking.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2 border-blue-300 text-blue-700 hover:bg-blue-50">
                            Détails
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                            Annuler
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucune réservation trouvée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vue Paiements */}
        <TabsContent value="payments">
          <Card className="border-purple-100">
            <CardHeader className="bg-purple-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-purple-800">Gestion des Paiements</CardTitle>
                  <CardDescription className="text-purple-600">
                    Liste de toutes les transactions financières
                  </CardDescription>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-sm text-purple-700">
                    {filteredPayments.length} paiement(s) trouvé(s)
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-purple-50">
                    <TableRow>
                      <TableHead className="text-purple-800">ID Transaction</TableHead>
                      <TableHead className="text-purple-800">Client</TableHead>
                      <TableHead className="text-purple-800">Montant</TableHead>
                      <TableHead className="text-purple-800">Date</TableHead>
                      <TableHead className="text-purple-800">Statut</TableHead>
                      <TableHead className="text-right text-purple-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-purple-50/50">
                        <TableCell className="font-medium text-purple-700">{payment.id.slice(0, 8)}...</TableCell>
                        <TableCell>User #{payment.userId.slice(0, 8)}</TableCell>
                        <TableCell className="font-medium text-green-700">{payment.amount.toLocaleString()} FCFA</TableCell>
                        <TableCell className="text-gray-600">{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(payment.status)} className={
                            payment.status === 'completed' ? "bg-green-100 text-green-800 hover:bg-green-100" :
                            payment.status === 'pending' ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                            "bg-red-100 text-red-800 hover:bg-red-100"
                          }>
                            {getStatusText(payment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucun paiement trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTab;