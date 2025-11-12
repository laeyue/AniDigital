import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  Scan,
  ShoppingBag,
  TrendingUp,
  Wallet,
  ArrowRight,
  AlertTriangle,
  Package,
  Droplets,
  Sun,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const quickStats = [
    {
      title: "Today's Weather",
      value: '28°C',
      description: 'Partly cloudy',
      icon: Sun,
      color: 'text-orange-500',
    },
    {
      title: 'Pending Orders',
      value: '3',
      description: 'Awaiting delivery',
      icon: Package,
      color: 'text-blue-500',
    },
    {
      title: 'Rainfall This Week',
      value: '45mm',
      description: 'Good for crops',
      icon: Droplets,
      color: 'text-cyan-500',
    },
    {
      title: 'Monthly Expenses',
      value: '₱12,450',
      description: '+5% from last month',
      icon: Wallet,
      color: 'text-green-500',
    },
  ];

  const quickActions = [
    {
      title: 'Climate Advisory',
      description: 'View weather forecasts and farming tips',
      icon: CloudSun,
      href: '/app/climate-advisory',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Scan a Crop',
      description: 'Diagnose plant health with AI',
      icon: Scan,
      href: '/app/crop-doctor',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Marketplace',
      description: 'Buy or sell farm products',
      icon: ShoppingBag,
      href: '/app/marketplace',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Market Prices',
      description: 'Track commodity prices',
      icon: TrendingUp,
      href: '/app/market-prices',
      color: 'bg-amber-500/10 text-amber-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.farmLocation} • {user?.farmSize} • Growing {user?.crops?.join(', ')}
        </p>
      </div>

      {/* Weather Alert */}
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="flex items-start gap-4 pt-6">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Weather Alert</h3>
            <p className="text-sm text-muted-foreground">
              Heavy rainfall expected this weekend. Consider adjusting your irrigation schedule.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/climate-advisory">View Details</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link to={action.href}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group-hover:translate-x-1 transition-transform">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New order received', detail: '50kg Rice from Maria Santos', time: '2 hours ago' },
              { action: 'Weather alert triggered', detail: 'Heavy rain forecast for tomorrow', time: '5 hours ago' },
              { action: 'Price update', detail: 'Rice price increased to ₱45/kg', time: '1 day ago' },
              { action: 'Crop scan completed', detail: 'Corn plant health: Good', time: '2 days ago' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
