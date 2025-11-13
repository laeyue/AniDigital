import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { marketPricesAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MarketPrices = () => {
  const [category, setCategory] = useState('all');
  const [days, setDays] = useState('7');

  const { data: pricesData, isLoading } = useQuery({
    queryKey: ['market-prices', { category: category !== 'all' ? category : undefined }],
    queryFn: () => marketPricesAPI.getLatest({ 
      category: category !== 'all' ? category : undefined 
    })
  });

  const prices = pricesData?.data?.prices || [];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vegetable', label: 'Vegetables' },
    { value: 'fruit', label: 'Fruits' },
    { value: 'grain', label: 'Grains' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'fish', label: 'Fish' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market Prices</h1>
        <p className="text-muted-foreground mt-1">
          Real-time commodity prices and market trends
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : prices.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prices.map((price: any) => (
            <Card key={price._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{price.commodity}</CardTitle>
                    {price.variety && (
                      <CardDescription className="mt-1">{price.variety}</CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary">{price.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-3xl font-bold">₱{price.price.average}</p>
                    <p className="text-sm text-muted-foreground">per {price.unit}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getTrendColor(price.trend)}`}>
                    {getTrendIcon(price.trend)}
                    {price.priceChange !== 0 && (
                      <span className="text-sm font-medium">
                        {price.priceChange > 0 ? '+' : ''}{price.priceChange}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Low</p>
                    <p className="text-lg font-semibold">₱{price.price.low}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">High</p>
                    <p className="text-lg font-semibold">₱{price.price.high}</p>
                  </div>
                </div>

                {price.market && (
                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{price.market.name}</p>
                        <p className="text-muted-foreground">
                          {price.market.location?.municipality}, {price.market.location?.province}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Updated: {new Date(price.date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No price data available</h3>
            <p className="text-muted-foreground text-center">
              Price data will appear here once available
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketPrices;
