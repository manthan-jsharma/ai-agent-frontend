// "use client";

// import { useState, useEffect } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Mail, Bot, User } from "lucide-react";
// import InboxTab from "@/frontend/app/tabs/Inbox";
// import TasksTab from "@/frontend/app/tabs/Tasks";
// import { useToast } from "@/hooks/use-toast";

// interface UserInterface {
//   email: string;
//   name: string | null;
//   isAuthenticated: boolean;
// }

// export default function EmailAgent() {
//   const [user, setUser] = useState<UserInterface>({
//     email: "",
//     name: null,
//     isAuthenticated: false,
//   });
//   const [activeTab, setActiveTab] = useState("inbox");
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Check if user is authenticated
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://localhost:8000/auth/status");
//       if (response.ok) {
//         const userData = await response.json();
//         if (userData.isAuthenticated) {
//           setUser({
//             email: userData.email,
//             name: userData.name || null,
//             isAuthenticated: true,
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await fetch("http://localhost:8000/auth/login");
//       if (!response.ok) {
//         throw new Error("Login request failed");
//       }

//       const data = await response.json();

//       // Redirect to Google OAuth
//       if (data.authorization_url) {
//         window.location.href = data.authorization_url;
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to get authorization URL",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       toast({
//         title: "Login Failed",
//         description: "Could not connect to authentication service",
//         variant: "destructive",
//       });
//     }
//   };

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show login screen if not authenticated
//   if (!user.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <Card className="w-full max-w-md">
//           <CardHeader className="text-center">
//             <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
//               <Bot className="w-6 h-6 text-white" />
//             </div>
//             <CardTitle className="text-2xl">AI Email Agent</CardTitle>
//             <p className="text-gray-600">Connect your Gmail to get started</p>
//           </CardHeader>
//           <CardContent>
//             <Button onClick={handleLogin} className="w-full" size="lg">
//               <Mail className="w-4 h-4 mr-2" />
//               Connect Gmail Account
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Show main app if authenticated
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <Bot className="w-8 h-8 text-blue-600 mr-3" />
//               <h1 className="text-xl font-semibold text-gray-900">
//                 AI Email Agent
//               </h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <div className="bg-blue-100 rounded-full p-1">
//                   <User className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   {user.name && (
//                     <p className="text-sm font-medium">{user.name}</p>
//                   )}
//                   <Badge variant="secondary" className="flex items-center">
//                     {user.email}
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-6"
//         >
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="inbox" className="flex items-center">
//               <Mail className="w-4 h-4 mr-2" />
//               Inbox
//             </TabsTrigger>
//             <TabsTrigger value="tasks" className="flex items-center">
//               <Bot className="w-4 h-4 mr-2" />
//               AI Tasks
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="inbox">
//             <InboxTab userEmail={user.email} />
//           </TabsContent>

//           <TabsContent value="tasks">
//             <TasksTab userEmail={user.email} />
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Environment variable for API base URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          setIsLoading(false);
          return;
        }
        const response = await fetch(`${API_BASE_URL}/auth/status`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast({
          title: "Error",
          description: "Authorization URL not received",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Could not initiate login",
        variant: "destructive",
      });
    }
  };

  // const handleLogout = () => {
  //   Cookies.remove("auth_token");  // Remove token cookie
  //   setIsAuthenticated(false);
  //   router.push("/");  // Redirect to login page (adjust if login page is different)
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  // if (isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
  //       <Card className="w-full max-w-md text-center p-8">
  //         <h2 className="text-2xl font-semibold mb-6">You are logged in</h2>
  //         <Button
  //           variant="destructive"
  //           onClick={handleLogout}
  //           className="w-full flex items-center justify-center"
  //           size="lg"
  //         >
  //           <LogOut className="w-5 h-5 mr-2" />
  //           Logout
  //         </Button>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">AI Email Agent</CardTitle>
          <p className="text-gray-600">Connect your Gmail to get started</p>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} className="w-full" size="lg">
            <Mail className="w-4 h-4 mr-2" />
            Connect Gmail Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
