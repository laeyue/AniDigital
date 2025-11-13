import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { weatherAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudSun, Droplets, Wind, Sun, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ClimateAdvisory = () => {
  const { user } = useAuth();
  const [location] = useState({
    municipality: user?.farmLocation?.split(',')[0]?.trim() || 'Cabanatuan',
    province: user?.farmLocation?.split(',')[1]?.trim() || 'Nueva Ecija'
  });

  const { data: weatherData, isLoading } = useQuery({
    queryKey: ['weather', location],
    queryFn: () => weatherAPI.getCurrent(location),
    enabled: !!location.municipality && !!location.province
  });

  const weather = weatherData?.data?.weather;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Climate Advisory</h1>
        <p className="text-muted-foreground mt-1">
          Weather forecast and farming recommendations for {location.municipality}, {location.province}
        </p>
      </div>

      {/* Weather Alerts */}
      {weather?.advisories && weather.advisories.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Weather Alert</AlertTitle>
          <AlertDescription>
            {weather.advisories[0].message}
          </AlertDescription>
        </Alert>
      )}

      {/* Current Weather */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Sun className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weather?.current?.temperature || 28}°C</div>
            <p className="text-xs text-muted-foreground">
              Feels like {weather?.current?.feelsLike || 31}°C
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weather?.current?.humidity || 75}%</div>
            <p className="text-xs text-muted-foreground">Relative humidity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
            <Wind className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weather?.current?.windSpeed || 15} km/h</div>
            <p className="text-xs text-muted-foreground">
              {weather?.current?.windDirection || 'NE'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">UV Index</CardTitle>
            <Sun className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weather?.current?.uvIndex || 7}</div>
            <p className="text-xs text-muted-foreground">High exposure</p>
          </CardContent>
        </Card>
      </div>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            7-Day Forecast
          </CardTitle>
          <CardDescription>Weather predictions for the week ahead</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weather?.forecast?.map((day: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <CloudSun className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{day.tempHigh}°</p>
                      <p className="text-sm text-muted-foreground">{day.tempLow}°</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{day.rainChance}% rain</p>
                      <p className="text-xs text-muted-foreground">{day.precipitation}mm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || <p className="text-muted-foreground">No forecast data available</p>}
          </div>
        </CardContent>
      </Card>

      {/* Farming Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Farming Recommendations
          </CardTitle>
          <CardDescription>AI-powered suggestions based on current weather</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weather?.farmingRecommendations?.map((rec: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{rec.activity}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec.recommendation}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {rec.priority}
                </span>
              </div>
            )) || (
              <p className="text-muted-foreground">
                No specific recommendations at this time. Weather conditions are normal.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClimateAdvisory;
