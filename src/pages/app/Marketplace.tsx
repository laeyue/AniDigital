import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Plus, Search, MapPin, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { search, category: category !== 'all' ? category : undefined }],
    queryFn: () => productsAPI.getAll({ 
      search: search || undefined,
      category: category !== 'all' ? category : undefined
    })
  });

  const products = productsData?.data?.products || [];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vegetable', label: 'Vegetables' },
    { value: 'fruit', label: 'Fruits' },
    { value: 'grain', label: 'Grains' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'seeds', label: 'Seeds' },
    { value: 'fertilizer', label: 'Fertilizer' },
    { value: 'equipment', label: 'Equipment' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Buy and sell agricultural products directly with farmers
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          List Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
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
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {product.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₱{product.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per {product.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {product.location?.municipality || 'Unknown'}, {product.location?.province || ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4" />
                    <span>
                      {product.quantity} {product.unit} available
                    </span>
                  </div>
                  {product.organic && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Organic
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button className="flex-1">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {search || category !== 'all' 
                ? 'Try adjusting your filters'
                : 'Be the first to list a product!'}
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              List Your Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Marketplace;
