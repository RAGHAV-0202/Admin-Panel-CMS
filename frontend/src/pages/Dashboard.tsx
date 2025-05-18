
import { useQuery } from "@tanstack/react-query";
import { getAllCalls, getAllCourses, getAllPayments, getAllCoupons } from "../services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, BookOpen, CreditCard, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  linkTo,
  isLoading,
  error
}: { 
  title: string;
  value: number;
  description: string;
  icon: any;
  linkTo: string;
  isLoading: boolean;
  error: any;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="h-9 w-16 bg-gray-200 animate-pulse rounded" />
      ) : error ? (
        <p className="text-red-500 text-sm">Error loading data</p>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </>
      )}
      <Link 
        to={linkTo}
        className="text-xs text-blue-600 hover:underline block mt-2"
      >
        View all
      </Link>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data: calls, isLoading: callsLoading, error: callsError } = useQuery({
    queryKey: ['calls'],
    queryFn: getAllCalls,
  });

  const { data: courses, isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
  });

  const { data: payments, isLoading: paymentsLoading, error: paymentsError } = useQuery({
    queryKey: ['payments'],
    queryFn: getAllPayments,
  });

  const { data: coupons, isLoading: couponsLoading, error: couponsError } = useQuery({
    queryKey: ['coupons'],
    queryFn: getAllCoupons,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Call Requests"
          value={calls?.length || 0}
          description="Total contact us call requests"
          icon={Phone}
          linkTo="/calls"
          isLoading={callsLoading}
          error={callsError}
        />
        <DashboardCard
          title="Courses"
          value={courses?.length || 0}
          description="Total courses"
          icon={BookOpen}
          linkTo="/courses"
          isLoading={coursesLoading}
          error={coursesError}
        />
        <DashboardCard
          title="Payment Requests"
          value={payments?.length || 0}
          description="Total payment verification requests"
          icon={CreditCard}
          linkTo="/payments"
          isLoading={paymentsLoading}
          error={paymentsError}
        />
        <DashboardCard
          title="Coupons"
          value={coupons?.length || 0}
          description="Total active coupons"
          icon={Tag}
          linkTo="/coupons"
          isLoading={couponsLoading}
          error={couponsError}
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/courses?new=true">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-center font-medium">Add New Course</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/coupons?new=true">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Tag className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-center font-medium">Create New Coupon</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/calls">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Phone className="h-8 w-8 text-orange-500 mb-2" />
                <p className="text-center font-medium">Manage Call Requests</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/payments">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CreditCard className="h-8 w-8 text-purple-500 mb-2" />
                <p className="text-center font-medium">Verify Payments</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
