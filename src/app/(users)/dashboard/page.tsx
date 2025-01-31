"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Package, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress"

interface DashboardData {
  verificationRate: number | null | undefined;
  totalProducts: number;
  verifiedToday: number;
  addedThisWeek: number;
  expiringSoon: number;
  latestProduct?: {
    batchNumber: string;
    productName: string;
    expiryDate: string;
  };
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!isSignedIn) {
    return null; // Prevent rendering while redirecting
  }

  if (!dashboardData) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+{dashboardData.addedThisWeek} this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.verifiedToday}</div>
            <Progress value={dashboardData.verificationRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{dashboardData.verificationRate}% verification rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Added This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.addedThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {((dashboardData.addedThisWeek / dashboardData.totalProducts) * 100).toFixed(1)}% of total products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">
              {((dashboardData.expiringSoon / dashboardData.totalProducts) * 100).toFixed(1)}% of total products
            </p>
          </CardContent>
        </Card>
      </div>
      {dashboardData.latestProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Product Added</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Batch Number:</strong> {dashboardData.latestProduct.batchNumber}
            </p>
            <p>
              <strong>Product Name:</strong> {dashboardData.latestProduct.productName}
            </p>
            <p>
              <strong>Expiry Date:</strong> {dashboardData.latestProduct.expiryDate}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
