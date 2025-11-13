import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, transactionsAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Plus, Search, MapPin, Package, Upload, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for creating product
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'vegetable',
    price: '',
    quantity: '',
    unit: 'kg',
    municipality: '',
    province: '',
    organic: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return productsAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success!',
        description: 'Your product has been listed on the marketplace.',
      });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create product',
        variant: 'destructive',
      });
    },
  });

  // Buy product mutation
  const buyProductMutation = useMutation({
    mutationFn: async (data: { product: string; quantity: number; totalAmount: number }) => {
      return transactionsAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Purchase Successful!',
        description: 'Your order has been placed.',
      });
      setIsBuyDialogOpen(false);
      setSelectedProduct(null);
      setBuyQuantity(1);
    },
    onError: (error: any) => {
      toast({
        title: 'Purchase Failed',
        description: error.response?.data?.message || 'Failed to complete purchase',
        variant: 'destructive',
      });
    },
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    data.append('unit', formData.unit);
    data.append('location[municipality]', formData.municipality);
    data.append('location[province]', formData.province);
    data.append('organic', formData.organic.toString());
    
    imageFiles.forEach((file) => {
      data.append('images', file);
    });

    createProductMutation.mutate(data);
  };

  const handleBuyProduct = () => {
    if (!selectedProduct) return;
    
    const totalAmount = selectedProduct.price * buyQuantity;
    buyProductMutation.mutate({
      product: selectedProduct._id,
      quantity: buyQuantity,
      totalAmount,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'vegetable',
      price: '',
      quantity: '',
      unit: 'kg',
      municipality: '',
      province: '',
      organic: false,
    });
    setImageFiles([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Buy and sell agricultural products directly with farmers
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsBuyDialogOpen(true);
                  }}
                  disabled={product.seller?._id === user?.id}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {product.seller?._id === user?.id ? 'Your Product' : 'Buy Now'}
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              List Your Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>List a New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to list your product on the marketplace
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.value !== 'all').map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product..."
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="lbs">Pound (lbs)</SelectItem>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="dozen">Dozen</SelectItem>
                    <SelectItem value="sack">Sack</SelectItem>
                    <SelectItem value="crate">Crate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="municipality">Municipality *</Label>
                <Input
                  id="municipality"
                  required
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  placeholder="e.g., Baguio City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Input
                  id="province"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="e.g., Benguet"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Product Images</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              {imageFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="organic"
                checked={formData.organic}
                onChange={(e) => setFormData({ ...formData, organic: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="organic" className="cursor-pointer">
                This is an organic product
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createProductMutation.isPending}>
                {createProductMutation.isPending ? 'Creating...' : 'List Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Buy Product Dialog */}
      <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Product</DialogTitle>
            <DialogDescription>
              Complete your purchase
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Price:</span>
                  <span>₱{selectedProduct.price} per {selectedProduct.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Available:</span>
                  <span>{selectedProduct.quantity} {selectedProduct.unit}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyQuantity">Quantity ({selectedProduct.unit})</Label>
                <Input
                  id="buyQuantity"
                  type="number"
                  min="1"
                  max={selectedProduct.quantity}
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(Number(e.target.value))}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₱{(selectedProduct.price * buyQuantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₱{(selectedProduct.price * buyQuantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBuyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBuyProduct}
              disabled={buyProductMutation.isPending || buyQuantity < 1}
            >
              {buyProductMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
