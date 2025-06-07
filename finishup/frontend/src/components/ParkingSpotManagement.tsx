import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getParkingSpots, updateParkingSpot } from "@/api/api";

interface ParkingSpot {
  ParkingSpotID: number;
  SpotType: string;
  Status: string;
  ParkID: number;
  ParkName?: string;
  LicensePlate?: string;
  StartTime?: string;
  EndTime?: string;
}

export function ParkingSpotManagement() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchParkingSpots = async () => {
      setLoading(true);
      try {
        const data = await getParkingSpots();
        setParkingSpots(data.map(spot => ({
          ...spot,
          ParkName: spot.ParkName || `Lot ${spot.ParkID}`,
        })));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch parking spots.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchParkingSpots();
  }, []);

  const handleReserveSpot = async (spotId: number) => {
    try {
      const updatedSpot = {
        Status: 'Reserved',
        LicensePlate: 'TEMP-123',
        StartTime: new Date().toISOString(),
        EndTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      };
      await updateParkingSpot(spotId, updatedSpot);
      setParkingSpots(spots =>
        spots.map(spot =>
          spot.ParkingSpotID === spotId ? { ...spot, ...updatedSpot } : spot
        )
      );
      toast({
        title: "Spot Reserved",
        description: `Parking spot #${spotId} has been reserved.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reserve spot.",
        variant: "destructive",
      });
    }
  };

  const handleEndSession = async (spotId: number) => {
    try {
      const updatedSpot = {
        Status: 'Available',
        LicensePlate: null,
        StartTime: null,
        EndTime: null,
      };
      await updateParkingSpot(spotId, updatedSpot);
      setParkingSpots(spots =>
        spots.map(spot =>
          spot.ParkingSpotID === spotId ? { ...spot, ...updatedSpot } : spot
        )
      );
      toast({
        title: "Session Ended",
        description: `Parking session for spot #${spotId} has been ended.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end session.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAvailable = async (spotId: number) => {
    try {
      const updatedSpot = { Status: 'Available' };
      await updateParkingSpot(spotId, updatedSpot);
      setParkingSpots(spots =>
        spots.map(spot =>
          spot.ParkingSpotID === spotId ? { ...spot, ...updatedSpot } : spot
        )
      );
      toast({
        title: "Spot Available",
        description: `Parking spot #${spotId} is now available.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark spot as available.",
        variant: "destructive",
      });
    }
  };

  const filteredSpots = parkingSpots.filter(spot => {
    const matchesStatus = filterStatus === "all" || spot.Status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType = filterType === "all" || spot.SpotType.toLowerCase() === filterType.toLowerCase();
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Occupied': return 'bg-red-100 text-red-800';
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpotTypeColor = (type: string) => {
    switch (type) {
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Compact': return 'bg-purple-100 text-purple-800';
      case 'Disabled': return 'bg-indigo-100 text-indigo-800';
      case 'Electric': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const occupancyStats = {
    total: parkingSpots.length,
    occupied: parkingSpots.filter(s => s.Status === 'Occupied').length,
    available: parkingSpots.filter(s => s.Status === 'Available').length,
    reserved: parkingSpots.filter(s => s.Status === 'Reserved').length,
    maintenance: parkingSpots.filter(s => s.Status === 'Maintenance').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Parking Spot Management</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{occupancyStats.total}</div>
              <p className="text-sm text-gray-600">Total Spots</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{occupancyStats.occupied}</div>
              <p className="text-sm text-gray-600">Occupied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{occupancyStats.available}</div>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{occupancyStats.reserved}</div>
              <p className="text-sm text-gray-600">Reserved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{occupancyStats.maintenance}</div>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Loading parking spots...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpots.map((spot) => (
            <Card key={spot.ParkingSpotID} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Spot #{spot.ParkingSpotID}</span>
                    </div>
                    <Badge className={getStatusColor(spot.Status)}>{spot.Status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <Badge className={getSpotTypeColor(spot.SpotType)}>{spot.SpotType}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium">{spot.ParkName}</span>
                    </div>
                  </div>
                  {spot.LicensePlate && (
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">{spot.LicensePlate}</span>
                      </div>
                      {spot.StartTime && spot.EndTime && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(spot.StartTime).toLocaleTimeString()} -{' '}
                            {new Date(spot.EndTime).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    {spot.Status === 'Available' && (
                      <Button size="sm" className="flex-1" onClick={() => handleReserveSpot(spot.ParkingSpotID)}>
                        Reserve
                      </Button>
                    )}
                    {spot.Status === 'Occupied' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEndSession(spot.ParkingSpotID)}
                      >
                        End Session
                      </Button>
                    )}
                    {spot.Status === 'Maintenance' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleMarkAvailable(spot.ParkingSpotID)}
                      >
                        Mark Available
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredSpots.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No parking spots found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}