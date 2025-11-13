import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { financialsAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Finances = () => {
  const [period, setPeriod] = useState('month');

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['financial-summary'],
    queryFn: () => financialsAPI.getSummary()
  });

  const { data: recordsData, isLoading: recordsLoading } = useQuery({
    queryKey: ['financial-records'],
    queryFn: () => financialsAPI.getAll()
  });

  const summary = summaryData?.data?.summary;
  const records = recordsData?.data?.records || [];

  const incomeRecords = records.filter((r: any) => r.type === 'income');
  const expenseRecords = records.filter((r: any) => r.type === 'expense');

  // Prepare chart data
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
    
    return last6Months.map(month => {
      const monthRecords = records.filter((r: any) => {
        const recordMonth = new Date(r.date).toLocaleDateString('en', { month: 'short' });
        return recordMonth === month;
      });
      
      const income = monthRecords
        .filter((r: any) => r.type === 'income')
        .reduce((sum: number, r: any) => sum + r.amount, 0);
      
      const expenses = monthRecords
        .filter((r: any) => r.type === 'expense')
        .reduce((sum: number, r: any) => sum + r.amount, 0);
      
      return { month, income, expenses, profit: income - expenses };
    });
  }, [records]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    
    expenseRecords.forEach((record: any) => {
      const cat = record.category.replace('_', ' ');
      categories[cat] = (categories[cat] || 0) + record.amount;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [expenseRecords]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ₱{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Farm Finances</h1>
          <p className="text-muted-foreground mt-1">
            Track your farm income and expenses
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₱{summary?.totalIncome?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₱{summary?.totalExpenses?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (summary?.netProfit || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              ₱{summary?.netProfit?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly comparison over last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Trend</CardTitle>
            <CardDescription>Net profit over last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Profit"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown by Category</CardTitle>
            <CardDescription>Distribution of your farm expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-around">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4 md:mt-0">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{entry.name}: ₱{entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Records Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {recordsLoading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ) : records.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.slice(0, 10).map((record: any) => (
                    <div key={record._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          record.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {record.type === 'income' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{record.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {record.category.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          record.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {record.type === 'income' ? '+' : '-'}₱{record.amount.toLocaleString()}
                        </p>
                        {record.paymentMethod && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {record.paymentMethod}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start tracking your farm finances
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Records</CardTitle>
              <CardDescription>All your farm income sources</CardDescription>
            </CardHeader>
            <CardContent>
              {incomeRecords.length > 0 ? (
                <div className="space-y-4">
                  {incomeRecords.map((record: any) => (
                    <div key={record._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{record.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        +₱{record.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No income records</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Records</CardTitle>
              <CardDescription>All your farm expenses</CardDescription>
            </CardHeader>
            <CardContent>
              {expenseRecords.length > 0 ? (
                <div className="space-y-4">
                  {expenseRecords.map((record: any) => (
                    <div key={record._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{record.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        -₱{record.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No expense records</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
