// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import InboxView from "@/frontend/app/tabs/Inbox";
// import TasksView from "@/frontend/app/tabs/Tasks";
// import { Bot, Mail, User } from "lucide-react";

// interface UserInterface {
//   email: string;
//   name: string | null;
// }

// export default function DashboardPage() {
//   const [user, setUser] = useState<UserInterface | null>(null);
//   const [tab, setTab] = useState("inbox");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const response = await fetch("http://localhost:8000/auth/status");
//       const data = await response.json();

//       if (data.isAuthenticated) {
//         setUser({ email: data.email, name: data.name || null });
//       } else {
//         router.push("/");
//       }
//     };

//     fetchUser();
//   }, []);

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600">
//         Verifying session...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <Bot className="w-7 h-7 text-blue-600 mr-2" />
//             <h1 className="text-xl font-semibold text-gray-900">
//               AI Email Agent
//             </h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-600" />
//             <span className="text-sm font-medium">{user.name}</span>
//             <Badge variant="secondary">{user.email}</Badge>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6">
//         <Tabs value={tab} onValueChange={setTab}>
//           <TabsList className="grid grid-cols-2 w-full mb-4">
//             <TabsTrigger
//               value="inbox"
//               className="flex items-center justify-center"
//             >
//               <Mail className="w-4 h-4 mr-2" />
//               Inbox
//             </TabsTrigger>
//             <TabsTrigger
//               value="tasks"
//               className="flex items-center justify-center"
//             >
//               <Bot className="w-4 h-4 mr-2" />
//               AI Tasks
//             </TabsTrigger>
//           </TabsList>

//           <InboxView userEmail={user.email} />
//           <TasksView userEmail={user.email} />
//         </Tabs>
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Cookies from "js-cookie";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import InboxView from "@/frontend/app/tabs/Inbox";
// import TasksView from "@/frontend/app/tabs/Tasks";
// import { Bot, Mail, User } from "lucide-react";

// interface UserInterface {
//   email: string;
//   name: string | null;
// }

// export default function DashboardPage() {
//   const [user, setUser] = useState<UserInterface | null>(null);
//   const [tab, setTab] = useState("inbox");
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const tokenInUrl = searchParams.get("token");
//     const tokenInCookie = Cookies.get("jwt_token");

//     if (tokenInUrl) {
//       // ✅ Save token in cookie (prod way)
//       Cookies.set("jwt_token", tokenInUrl, { expires: 7 });

//       // ✅ Clean up URL
//       const url = new URL(window.location.href);
//       url.searchParams.delete("token");
//       window.history.replaceState({}, document.title, url.toString());
//     }

//     const token = tokenInUrl || tokenInCookie;
//     if (!token) {
//       router.push("/");
//       return;
//     }

//     // ✅ Auth check with token
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("http://localhost:8000/auth/status", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();

//         if (data.isAuthenticated) {
//           setUser({ email: data.email, name: data.name || null });
//         } else {
//           router.push("/");
//         }
//       } catch (err) {
//         console.error("Auth check failed", err);
//         router.push("/");
//       }
//     };

//     fetchUser();
//   }, []);

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600">
//         Verifying session...
//       </div>
//     );
//   }

//   return (
//       <div className="min-h-screen bg-gray-50">

//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <Bot className="w-7 h-7 text-blue-600 mr-2" />
//             <h1 className="text-xl font-semibold text-gray-900">
//               AI Email Agent
//             </h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-600" />
//             <span className="text-sm font-medium">{user.name}</span>
//                       <Badge variant="secondary">{user.email}</Badge>

//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6">
//         <Tabs value={tab} onValueChange={setTab}>
//           <TabsList className="flex gap-2 mb-4">
//             <TabsTrigger
//               value="inbox"
//               className="flex items-center justify-center"
//             >
//               <Mail className="w-4 h-4 mr-2" />
//               Inbox
//             </TabsTrigger>
//             <TabsTrigger
//               value="tasks"
//               className="flex items-center justify-center"
//             >
//               <Bot className="w-4 h-4 mr-2" />
//               AI Tasks
//             </TabsTrigger>
//           </TabsList>

//           {tab === "inbox" && <InboxView userEmail={user.email} />}
//           {tab === "tasks" && <TasksView userEmail={user.email} />}
//         </Tabs>
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Cookies from "js-cookie";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import InboxView from "@/frontend/app/tabs/Inbox";
// import TasksView from "@/frontend/app/tabs/Tasks";
// import { Bot, Mail, User } from "lucide-react";
// import { Eye, EyeOff } from "lucide-react";
// interface UserInterface {
//   email: string;
//   name: string | null;
// }

// export default function DashboardPage() {
//   const [user, setUser] = useState<UserInterface | null>(null);
//   const [tab, setTab] = useState("inbox");
//   const [watchActive, setWatchActive] = useState(true); // default true
//   const [isToggling, setIsToggling] = useState(false); // for debounce/disable

//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const tokenInUrl = searchParams.get("token");
//     const tokenInCookie = Cookies.get("jwt_token");

//     if (tokenInUrl) {
//       Cookies.set("jwt_token", tokenInUrl, { expires: 7 });

//       const url = new URL(window.location.href);
//       url.searchParams.delete("token");
//       window.history.replaceState({}, document.title, url.toString());
//     }

//     const token = tokenInUrl || tokenInCookie;
//     if (!token) {
//       router.push("/");
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await fetch("http://localhost:8000/auth/status", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();

//         if (data.isAuthenticated) {
//           setUser({ email: data.email, name: data.name || null });
//         } else {
//           router.push("/");
//         }
//       } catch (err) {
//         console.error("Auth check failed", err);
//         router.push("/");
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleToggle = async () => {
//     if (!user) return;
//     setIsToggling(true);

//     const endpoint = watchActive ? "stop-watch" : "setup-watch";
//     try {
//       const res = await fetch(`http://localhost:8000/pubsub/${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_email: user.email }),
//       });

//       const data = await res.json();
//       if (data.status === "success") {
//         setWatchActive(!watchActive);
//       } else {
//         console.error("Watch toggle failed:", data);
//       }
//     } catch (err) {
//       console.error("Toggle error:", err);
//     } finally {
//       setIsToggling(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600">
//         Verifying session...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <Bot className="w-7 h-7 text-blue-600 mr-2" />
//             <h1 className="text-xl font-semibold text-gray-900">
//               AI Email Agent
//             </h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-600" />
//             <span className="text-sm font-medium">{user.name}</span>
//             <Badge variant="secondary">{user.email}</Badge>

//             {/* 👇 TOGGLE BUTTON NEXT TO EMAIL */}
//             <label className="inline-flex items-center cursor-pointer ml-3">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={watchActive}
//                 onChange={handleToggle}
//                 disabled={isToggling}
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 relative transition-all">
//                 <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-full"></div>
//               </div>
//               <span
//                 className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1 ${
//                   watchActive
//                     ? "bg-green-100 text-green-700 border border-green-500"
//                     : "bg-red-100 text-red-700 border border-red-500"
//                 }`}
//               >
//                 {watchActive ? (
//                   <Eye className="w-3 h-3" />
//                 ) : (
//                   <EyeOff className="w-3 h-3" />
//                 )}
//                 {watchActive ? "Watching Enabled" : "Watching Disabled"}
//               </span>
//             </label>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6">
//         <Tabs value={tab} onValueChange={setTab}>
//           <TabsList className="flex gap-2 mb-4">
//             <TabsTrigger
//               value="inbox"
//               className="flex items-center justify-center"
//             >
//               <Mail className="w-4 h-4 mr-2" />
//               Inbox
//             </TabsTrigger>
//             <TabsTrigger
//               value="tasks"
//               className="flex items-center justify-center"
//             >
//               <Bot className="w-4 h-4 mr-2" />
//               AI Tasks
//             </TabsTrigger>
//           </TabsList>

//           {tab === "inbox" && <InboxView userEmail={user.email} />}
//           {tab === "tasks" && <TasksView userEmail={user.email} />}
//         </Tabs>
//       </main>
//     </div>
//   );
// }
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InboxView from "@/frontend/app/tabs/Inbox";
import TasksView from "@/frontend/app/tabs/Tasks";
import { Bot, Mail, User } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

interface UserInterface {
  email: string;
  name: string | null;
}

function DashboardContent() {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [tab, setTab] = useState("inbox");
  const [watchActive, setWatchActive] = useState(true); // default true
  const [isToggling, setIsToggling] = useState(false); // for debounce/disable

  const router = useRouter();
  const searchParams = useSearchParams();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const tokenInUrl = searchParams.get("token");
    const tokenInCookie = Cookies.get("jwt_token");

    if (tokenInUrl) {
      Cookies.set("jwt_token", tokenInUrl, { expires: 7 });

      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, document.title, url.toString());
    }

    const token = tokenInUrl || tokenInCookie;
    if (!token) {
      router.push("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.isAuthenticated) {
          setUser({ email: data.email, name: data.name || null });
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Auth check failed", err);
        router.push("/");
      }
    };

    fetchUser();
  }, []);

  const handleToggle = async () => {
    if (!user) return;
    setIsToggling(true);

    const endpoint = watchActive ? "stop-watch" : "setup-watch";
    try {
      const res = await fetch(`${API_BASE_URL}/pubsub/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: user.email }),
      });

      const data = await res.json();
      if (data.status === "success") {
        setWatchActive(!watchActive);
      } else {
        console.error("Watch toggle failed:", data);
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setIsToggling(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Verifying session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bot className="w-7 h-7 text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">
              AI Email Agent
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">{user.name}</span>
            <Badge variant="secondary">{user.email}</Badge>

            <label className="inline-flex items-center cursor-pointer ml-3">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={watchActive}
                onChange={handleToggle}
                disabled={isToggling}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 relative transition-all">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-full"></div>
              </div>
              <span
                className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                  watchActive
                    ? "bg-green-100 text-green-700 border border-green-500"
                    : "bg-red-100 text-red-700 border border-red-500"
                }`}
              >
                {watchActive ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
                {watchActive ? "Watching Enabled" : "Watching Disabled"}
              </span>
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex gap-2 mb-4">
            <TabsTrigger
              value="inbox"
              className="flex items-center justify-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Inbox
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="flex items-center justify-center"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Tasks
            </TabsTrigger>
          </TabsList>

          {tab === "inbox" && <InboxView userEmail={user.email} />}
          {tab === "tasks" && <TasksView userEmail={user.email} />}
        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
