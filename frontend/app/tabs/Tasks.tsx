// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   Bot,
//   Send,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   RefreshCw,
//   Loader2,
//   Eye,
//   FileEdit,
//   Sparkles,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface AIResponse {
//   id: string;
//   original_email_id: string;
//   ai_response: string;
//   status: string;
//   created_at: string;
//   sent_at: string | null;
//   subject: string;
//   sender: string;
//   draft_id: string | null;
//   thread_id: string | null;
// }

// interface AutomationSettings {
//   auto_draft: boolean;
//   auto_send: boolean;
// }

// interface TasksTabProps {
//   userEmail: string;
// }

// export default function TasksTab({ userEmail }: TasksTabProps) {
//   const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [sendingId, setSendingId] = useState<string | null>(null);
//   const [creatingDraftId, setCreatingDraftId] = useState<string | null>(null);
//   const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
//   const [automationSettings, setAutomationSettings] =
//     useState<AutomationSettings>({
//       auto_draft: false,
//       auto_send: false,
//     });
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchAIResponses();
//     fetchAutomationSettings();
//   }, [userEmail]);

//   const fetchAIResponses = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `http://localhost:8000/agent/responses/${userEmail}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setAiResponses(data.responses || []);
//       }
//     } catch (error) {
//       console.error("Failed to fetch AI responses:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch AI responses. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchAutomationSettings = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/agent/automation-settings/${userEmail}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setAutomationSettings(data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch automation settings:", error);
//     }
//   };

//   const handleSendResponse = async (responseId: string) => {
//     setSendingId(responseId);
//     try {
//       const response = await fetch(
//         `http://localhost:8000/agent/send-response`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             response_id: responseId,
//             user_email: userEmail,
//           }),
//         }
//       );

//       if (response.ok) {
//         toast({
//           title: "Response sent!",
//           description: "AI response has been sent successfully",
//         });

//         // Update the status locally
//         setAiResponses((prev) =>
//           prev.map((resp) =>
//             resp.id === responseId ? { ...resp, status: "sent" } : resp
//           )
//         );
//       } else {
//         throw new Error("Failed to send response");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to send AI response. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setSendingId(null);
//     }
//   };

//   const handleCreateDraft = async (responseId: string) => {
//     setCreatingDraftId(responseId);
//     try {
//       const response = await fetch(`http://localhost:8000/agent/create-draft`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           response_id: responseId,
//           user_email: userEmail,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         toast({
//           title: "Draft created!",
//           description: "AI response has been saved as a draft in Gmail",
//         });

//         // Update the draft ID locally
//         setAiResponses((prev) =>
//           prev.map((resp) =>
//             resp.id === responseId ? { ...resp, draft_id: data.draft_id } : resp
//           )
//         );
//       } else {
//         throw new Error("Failed to create draft");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create Gmail draft. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setCreatingDraftId(null);
//     }
//   };

//   const handleRegenerateResponse = async (email: AIResponse) => {
//     setRegeneratingId(email.id);
//     try {
//       const response = await fetch(
//         "http://localhost:8000/agent/regenerate-response",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             user_email: userEmail,
//             email_id: email.original_email_id,
//             thread_id: email.thread_id,
//             email_content: "", // We don't have the original content here, but the backend will fetch it
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         toast({
//           title: "New response generated",
//           description: "An alternative AI response has been created",
//         });

//         // Refresh the list to show the new response
//         fetchAIResponses();
//       } else {
//         throw new Error("Failed to regenerate response");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description:
//           "Failed to generate alternative response. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setRegeneratingId(null);
//     }
//   };

//   const openInGmail = (draftId: string) => {
//     if (draftId) {
//       window.open(
//         `https://mail.google.com/mail/u/0/#drafts?compose=${draftId}`,
//         "_blank"
//       );
//     } else {
//       toast({
//         title: "Error",
//         description: "Draft ID not available",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAutomationChange = async (
//     setting: "auto_draft" | "auto_send",
//     value: boolean
//   ) => {
//     const newSettings = { ...automationSettings };

//     // If turning off auto_draft, also turn off auto_send
//     if (setting === "auto_draft" && !value) {
//       newSettings.auto_draft = false;
//       newSettings.auto_send = false;
//     }
//     // If turning on auto_send, also turn on auto_draft
//     else if (setting === "auto_send" && value) {
//       newSettings.auto_draft = true;
//       newSettings.auto_send = true;
//     }
//     // Otherwise just update the specific setting
//     else {
//       newSettings[setting] = value;
//     }

//     try {
//       const response = await fetch(
//         "http://localhost:8000/agent/automation-settings",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             user_email: userEmail,
//             auto_draft: newSettings.auto_draft,
//             auto_send: newSettings.auto_send,
//           }),
//         }
//       );

//       if (response.ok) {
//         setAutomationSettings(newSettings);
//         toast({
//           title: "Automation settings updated",
//           description: `Email automation has been ${
//             value ? "enabled" : "disabled"
//           }`,
//         });
//       } else {
//         throw new Error("Failed to update automation settings");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update automation settings. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "generated":
//         return <AlertCircle className="w-4 h-4 text-yellow-500" />;
//       case "sent":
//         return <CheckCircle className="w-4 h-4 text-green-500" />;
//       default:
//         return <Clock className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "generated":
//         return "bg-yellow-100 text-yellow-800";
//       case "sent":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (isLoading) {
//     return (
//       <Card>
//         <CardContent className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
//             <p className="text-gray-500">Loading AI tasks...</p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="flex items-center">
//           <Bot className="w-5 h-5 mr-2" />
//           AI Response Tasks ({aiResponses.length})
//         </CardTitle>
//         <div className="flex items-center space-x-6">
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="auto-draft"
//               checked={automationSettings.auto_draft}
//               onCheckedChange={(checked) =>
//                 handleAutomationChange("auto_draft", checked)
//               }
//             />
//             <Label htmlFor="auto-draft" className="text-sm">
//               Auto-create drafts
//             </Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="auto-send"
//               checked={automationSettings.auto_send}
//               onCheckedChange={(checked) =>
//                 handleAutomationChange("auto_send", checked)
//               }
//               disabled={!automationSettings.auto_draft}
//             />
//             <Label htmlFor="auto-send" className="text-sm">
//               Auto-send emails
//             </Label>
//           </div>
//           <Button variant="outline" size="sm" onClick={fetchAIResponses}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {aiResponses.length === 0 ? (
//           <div className="text-center py-8">
//             <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">No AI responses generated yet</p>
//             <p className="text-sm text-gray-400 mt-2">
//               AI will automatically generate responses for incoming emails
//             </p>
//           </div>
//         ) : (
//           <ScrollArea className="h-[600px]">
//             <div className="space-y-4">
//               {aiResponses.map((response) => (
//                 <div
//                   key={response.id}
//                   className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex-1">
//                       <h3 className="font-medium text-gray-900 mb-1">
//                         Re: {response.subject || "(No Subject)"}
//                       </h3>
//                       <p className="text-sm text-gray-600 mb-2">
//                         Original from: {response.sender}
//                       </p>
//                     </div>
//                     <div className="flex flex-col items-end space-y-2">
//                       <Badge className={getStatusColor(response.status)}>
//                         {getStatusIcon(response.status)}
//                         <span className="ml-1 capitalize">
//                           {response.status}
//                         </span>
//                       </Badge>
//                       <div className="flex items-center text-xs text-gray-500">
//                         <Clock className="w-3 h-3 mr-1" />
//                         {formatDate(response.created_at)}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 rounded-md p-3 mb-3">
//                     <p className="text-sm text-gray-700 whitespace-pre-wrap">
//                       {response.ai_response}
//                     </p>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     {response.status === "generated" && (
//                       <Button
//                         onClick={() => handleSendResponse(response.id)}
//                         disabled={sendingId === response.id}
//                         size="sm"
//                       >
//                         {sendingId === response.id ? (
//                           <>
//                             <Loader2 className="w-3 h-3 mr-2 animate-spin" />
//                             Sending...
//                           </>
//                         ) : (
//                           <>
//                             <Send className="w-3 h-3 mr-2" />
//                             Send Response
//                           </>
//                         )}
//                       </Button>
//                     )}

//                     {!response.draft_id && response.status === "generated" && (
//                       <Button
//                         onClick={() => handleCreateDraft(response.id)}
//                         disabled={creatingDraftId === response.id}
//                         variant="outline"
//                         size="sm"
//                       >
//                         {creatingDraftId === response.id ? (
//                           <>
//                             <Loader2 className="w-3 h-3 mr-2 animate-spin" />
//                             Creating...
//                           </>
//                         ) : (
//                           <>
//                             <FileEdit className="w-3 h-3 mr-2" />
//                             Create Draft
//                           </>
//                         )}
//                       </Button>
//                     )}

//                     {response.draft_id && (
//                       <Button
//                         onClick={() => openInGmail(response.draft_id!)}
//                         variant="outline"
//                         size="sm"
//                       >
//                         <Eye className="w-3 h-3 mr-2" />
//                         View in Gmail
//                       </Button>
//                     )}

//                     <Button
//                       onClick={() => handleRegenerateResponse(response)}
//                       disabled={regeneratingId === response.id}
//                       variant="secondary"
//                       size="sm"
//                     >
//                       {regeneratingId === response.id ? (
//                         <>
//                           <Loader2 className="w-3 h-3 mr-2 animate-spin" />
//                           Generating...
//                         </>
//                       ) : (
//                         <>
//                           <Sparkles className="w-3 h-3 mr-2" />
//                           Generate Another Response
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bot,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  Eye,
  FileEdit,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIResponse {
  id: string;
  original_email_id: string;
  ai_response: string;
  status: string;
  created_at: string;
  sent_at: string | null;
  subject: string;
  sender: string;
  draft_id: string | null;
  thread_id: string | null;
}

interface AutomationSettings {
  auto_draft: boolean;
  auto_send: boolean;
}

interface TasksTabProps {
  userEmail: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TasksTab({ userEmail }: TasksTabProps) {
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [creatingDraftId, setCreatingDraftId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [automationSettings, setAutomationSettings] =
    useState<AutomationSettings>({
      auto_draft: false,
      auto_send: false,
    });
  const { toast } = useToast();

  useEffect(() => {
    fetchAIResponses();
    fetchAutomationSettings();
  }, [userEmail]);

  const fetchAIResponses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/agent/responses/${userEmail}`
      );
      if (response.ok) {
        const data = await response.json();
        setAiResponses(data.responses || []);
      }
    } catch (error) {
      console.error("Failed to fetch AI responses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch AI responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAutomationSettings = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/agent/automation-settings/${userEmail}`
      );
      if (response.ok) {
        const data = await response.json();
        setAutomationSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch automation settings:", error);
    }
  };

  const handleSendResponse = async (responseId: string) => {
    setSendingId(responseId);
    try {
      const response = await fetch(`${API_BASE_URL}/agent/send-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response_id: responseId,
          user_email: userEmail,
        }),
      });

      if (response.ok) {
        toast({
          title: "Response sent!",
          description: "AI response has been sent successfully",
        });

        // Update the status locally
        setAiResponses((prev) =>
          prev.map((resp) =>
            resp.id === responseId ? { ...resp, status: "sent" } : resp
          )
        );
      } else {
        throw new Error("Failed to send response");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingId(null);
    }
  };

  const handleCreateDraft = async (responseId: string) => {
    setCreatingDraftId(responseId);
    try {
      const response = await fetch(`${API_BASE_URL}/agent/create-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response_id: responseId,
          user_email: userEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Draft created!",
          description: "AI response has been saved as a draft in Gmail",
        });

        // Update the draft ID locally
        setAiResponses((prev) =>
          prev.map((resp) =>
            resp.id === responseId ? { ...resp, draft_id: data.draft_id } : resp
          )
        );
      } else {
        throw new Error("Failed to create draft");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Gmail draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingDraftId(null);
    }
  };

  const handleRegenerateResponse = async (email: AIResponse) => {
    setRegeneratingId(email.id);
    try {
      const response = await fetch(
        `${API_BASE_URL}/agent/regenerate-response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_email: userEmail,
            email_id: email.original_email_id,
            thread_id: email.thread_id,
            email_content: "", // We don't have the original content here, but the backend will fetch it
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "New response generated",
          description: "An alternative AI response has been created",
        });

        // Refresh the list to show the new response
        fetchAIResponses();
      } else {
        throw new Error("Failed to regenerate response");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to generate alternative response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegeneratingId(null);
    }
  };

  const openInGmail = (draftId: string) => {
    if (draftId) {
      window.open(
        `https://mail.google.com/mail/u/0/#drafts?compose=${draftId}`,
        "_blank"
      );
    } else {
      toast({
        title: "Error",
        description: "Draft ID not available",
        variant: "destructive",
      });
    }
  };

  const handleAutomationChange = async (
    setting: "auto_draft" | "auto_send",
    value: boolean
  ) => {
    const newSettings = { ...automationSettings };

    // If turning off auto_draft, also turn off auto_send
    if (setting === "auto_draft" && !value) {
      newSettings.auto_draft = false;
      newSettings.auto_send = false;
    }
    // If turning on auto_send, also turn on auto_draft
    else if (setting === "auto_send" && value) {
      newSettings.auto_draft = true;
      newSettings.auto_send = true;
    }
    // Otherwise just update the specific setting
    else {
      newSettings[setting] = value;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/agent/automation-settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_email: userEmail,
            auto_draft: newSettings.auto_draft,
            auto_send: newSettings.auto_send,
          }),
        }
      );

      if (response.ok) {
        setAutomationSettings(newSettings);
        toast({
          title: "Automation settings updated",
          description: `Email automation has been ${
            value ? "enabled" : "disabled"
          }`,
        });
      } else {
        throw new Error("Failed to update automation settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update automation settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "generated":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-yellow-100 text-yellow-800";
      case "sent":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-500">Loading AI tasks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          AI Response Tasks ({aiResponses.length})
        </CardTitle>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-draft"
              checked={automationSettings.auto_draft}
              onCheckedChange={(checked) =>
                handleAutomationChange("auto_draft", checked)
              }
            />
            <Label htmlFor="auto-draft" className="text-sm">
              Auto-create drafts
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-send"
              checked={automationSettings.auto_send}
              onCheckedChange={(checked) =>
                handleAutomationChange("auto_send", checked)
              }
              disabled={!automationSettings.auto_draft}
            />
            <Label htmlFor="auto-send" className="text-sm">
              Auto-send emails
            </Label>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAIResponses}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {aiResponses.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No AI responses generated yet</p>
            <p className="text-sm text-gray-400 mt-2">
              AI will automatically generate responses for incoming emails
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {aiResponses.map((response) => (
                <div
                  key={response.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Re: {response.subject || "(No Subject)"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Original from: {response.sender}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(response.status)}>
                        {getStatusIcon(response.status)}
                        <span className="ml-1 capitalize">
                          {response.status}
                        </span>
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(response.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 mb-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {response.ai_response}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {response.status === "generated" && (
                      <Button
                        onClick={() => handleSendResponse(response.id)}
                        disabled={sendingId === response.id}
                        size="sm"
                      >
                        {sendingId === response.id ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 mr-2" />
                            Send Response
                          </>
                        )}
                      </Button>
                    )}

                    {!response.draft_id && response.status === "generated" && (
                      <Button
                        onClick={() => handleCreateDraft(response.id)}
                        disabled={creatingDraftId === response.id}
                        variant="outline"
                        size="sm"
                      >
                        {creatingDraftId === response.id ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <FileEdit className="w-3 h-3 mr-2" />
                            Create Draft
                          </>
                        )}
                      </Button>
                    )}

                    {response.draft_id && (
                      <Button
                        onClick={() => openInGmail(response.draft_id!)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        View in Gmail
                      </Button>
                    )}

                    <Button
                      onClick={() => handleRegenerateResponse(response)}
                      disabled={regeneratingId === response.id}
                      variant="secondary"
                      size="sm"
                    >
                      {regeneratingId === response.id ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-2" />
                          Generate Another Response
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   Bot,
//   Send,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   RefreshCw,
//   Loader2,
//   Eye,
//   FileEdit,
//   Sparkles,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface AIResponse {
//   id: string;
//   original_email_id: string;
//   ai_response: string;
//   status: string;
//   created_at: string;
//   sent_at: string | null;
//   subject: string;
//   sender: string;
//   draft_id: string | null;
//   thread_id: string | null;
// }

// interface AutomationSettings {
//   auto_draft: boolean;
//   auto_send: boolean;
// }

// interface TasksTabProps {
//   userEmail: string;
// }

// export default function TasksTab({ userEmail }: TasksTabProps) {
//   const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [sendingId, setSendingId] = useState<string | null>(null);
//   const [creatingDraftId, setCreatingDraftId] = useState<string | null>(null);
//   const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
//   const [automationSettings, setAutomationSettings] =
//     useState<AutomationSettings>({
//       auto_draft: false,
//       auto_send: false,
//     });
//   const { toast } = useToast();

//   const baseUrl =
//     process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

//   useEffect(() => {
//     fetchAIResponses();
//     fetchAutomationSettings();
//   }, [userEmail]);

//   const fetchAIResponses = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${baseUrl}/agent/responses/${userEmail}`);
//       if (response.ok) {
//         const data = await response.json();
//         setAiResponses(data.responses || []);
//       }
//     } catch (error) {
//       console.error("Failed to fetch AI responses:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch AI responses. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchAutomationSettings = async () => {
//     try {
//       const response = await fetch(
//         `${baseUrl}/agent/automation-settings/${userEmail}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setAutomationSettings(data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch automation settings:", error);
//     }
//   };

//   const handleSendResponse = async (responseId: string) => {
//     setSendingId(responseId);
//     try {
//       const response = await fetch(`${baseUrl}/agent/send-response`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           response_id: responseId,
//           user_email: userEmail,
//         }),
//       });

//       if (response.ok) {
//         toast({
//           title: "Response sent!",
//           description: "AI response has been sent successfully",
//         });

//         setAiResponses((prev) =>
//           prev.map((resp) =>
//             resp.id === responseId ? { ...resp, status: "sent" } : resp
//           )
//         );
//       } else {
//         throw new Error("Failed to send response");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to send AI response. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setSendingId(null);
//     }
//   };

//   const handleCreateDraft = async (responseId: string) => {
//     setCreatingDraftId(responseId);
//     try {
//       const response = await fetch(`${baseUrl}/agent/create-draft`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           response_id: responseId,
//           user_email: userEmail,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         toast({
//           title: "Draft created!",
//           description: "AI response has been saved as a draft in Gmail",
//         });

//         setAiResponses((prev) =>
//           prev.map((resp) =>
//             resp.id === responseId ? { ...resp, draft_id: data.draft_id } : resp
//           )
//         );
//       } else {
//         throw new Error("Failed to create draft");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create Gmail draft. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setCreatingDraftId(null);
//     }
//   };

//   const handleRegenerateResponse = async (email: AIResponse) => {
//     setRegeneratingId(email.id);
//     try {
//       const response = await fetch(`${baseUrl}/agent/regenerate-response`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           user_email: userEmail,
//           email_id: email.original_email_id,
//           thread_id: email.thread_id,
//           email_content: "", // Backend fetches content
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         toast({
//           title: "New response generated",
//           description: "An alternative AI response has been created",
//         });

//         fetchAIResponses();
//       } else {
//         throw new Error("Failed to regenerate response");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description:
//           "Failed to generate alternative response. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setRegeneratingId(null);
//     }
//   };

//   const openInGmail = (draftId: string) => {
//     if (draftId) {
//       window.open(
//         `https://mail.google.com/mail/u/0/#drafts?compose=${draftId}`,
//         "_blank"
//       );
//     } else {
//       toast({
//         title: "Error",
//         description: "Draft ID not available",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAutomationChange = async (
//     setting: "auto_draft" | "auto_send",
//     value: boolean
//   ) => {
//     const newSettings = { ...automationSettings };

//     if (setting === "auto_draft" && !value) {
//       newSettings.auto_draft = false;
//       newSettings.auto_send = false;
//     } else if (setting === "auto_send" && value) {
//       newSettings.auto_draft = true;
//       newSettings.auto_send = true;
//     } else {
//       newSettings[setting] = value;
//     }

//     try {
//       const response = await fetch(`${baseUrl}/agent/automation-settings`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           user_email: userEmail,
//           auto_draft: newSettings.auto_draft,
//           auto_send: newSettings.auto_send,
//         }),
//       });

//       if (response.ok) {
//         setAutomationSettings(newSettings);
//         toast({
//           title: "Automation settings updated",
//           description: `Email automation has been ${
//             value ? "enabled" : "disabled"
//           }`,
//         });
//       } else {
//         throw new Error("Failed to update automation settings");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update automation settings. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "generated":
//         return <AlertCircle className="w-4 h-4 text-yellow-500" />;
//       case "sent":
//         return <CheckCircle className="w-4 h-4 text-green-500" />;
//       default:
//         return <Clock className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "generated":
//         return "bg-yellow-100 text-yellow-800";
//       case "sent":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (isLoading) {
//     return (
//       <Card>
//         <CardContent className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
//             <p className="text-gray-500">Loading AI tasks...</p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="flex items-center">
//           <Bot className="w-5 h-5 mr-2" />
//           AI Response Tasks ({aiResponses.length})
//         </CardTitle>
//         <div className="flex items-center space-x-6">
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="auto-draft"
//               checked={automationSettings.auto_draft}
//               onCheckedChange={(checked) =>
//                 handleAutomationChange("auto_draft", checked)
//               }
//             />
//             <Label htmlFor="auto-draft" className="text-sm">
//               Auto-create drafts
//             </Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="auto-send"
//               checked={automationSettings.auto_send}
//               onCheckedChange={(checked) =>
//                 handleAutomationChange("auto_send", checked)
//               }
//               disabled={!automationSettings.auto_draft}
//             />
//             <Label htmlFor="auto-send" className="text-sm">
//               Auto-send emails
//             </Label>
//           </div>
//           <Button variant="outline" size="sm" onClick={fetchAIResponses}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {aiResponses.length === 0 ? (
//           <div className="text-center py-8">
//             <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">No AI responses generated yet</p>
//             <p className="text-sm text-gray-400 mt-2">
//               AI will automatically generate responses for incoming emails
//             </p>
//           </div>
//         ) : (
//           <ScrollArea className="h-[600px]">
//             <div className="space-y-4">
//               {aiResponses.map((response) => (
//                 <div
//                   key={response.id}
//                   className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex-1">
//                       <h3 className="font-medium text-gray-900 mb-1">
//                         Re: {response.subject || "(No Subject)"}
//                       </h3>
//                       <p className="text-sm text-gray-600 mb-2">
//                         Original from: {response.sender}
//                       </p>
//                     </div>
//                     <div className="flex flex-col items-end space-y-2">
//                       <Badge className={getStatusColor(response.status)}>
//                         {getStatusIcon(response.status)}
//                         <span className="ml-1 capitalize">
//                           {response.status}
//                         </span>
//                       </Badge>
//                       <div className="flex items-center text-xs text-gray-500">
//                         <Clock className="w-3 h-3 mr-1" />
//                         {formatDate(response.created_at)}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 rounded-md p-3 mb-3">
//                     <p className="text-sm text-gray-700 whitespace-pre-wrap">
//                       {response.ai_response}
//                     </p>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     {response.status === "generated" && (
//                       <Button
//                         onClick={() => handleSendResponse(response.id)}
//                         disabled={sendingId === response.id}
//                         size="sm"
//                       >
//                         {sendingId === response.id ? (
//                           <>
//                             <Loader2 className="w-3 h-3 mr-2 animate-spin" />
//                             Sending...
//                           </>
//                         ) : (
//                           <>
//                             <Send className="w-3 h-3 mr-2" />
//                             Send Response
//                           </>
//                         )}
//                       </Button>
//                     )}

//                     {!response.draft_id && response.status === "generated" && (
//                       <Button
//                         onClick={() => handleCreateDraft(response.id)}
//                         disabled={creatingDraftId === response.id}
//                         variant="outline"
//                         size="sm"
//                       >
//                         {creatingDraftId === response.id ? (
//                           <>
//                             <Loader2 className="w-3 h-3 mr-2 animate-spin" />
//                             Creating...
//                           </>
//                         ) : (
//                           <>
//                             <FileEdit className="w-3 h-3 mr-2" />
//                             Create Draft
//                           </>
//                         )}
//                       </Button>
//                     )}

//                     {response.draft_id && (
//                       <Button
//                         onClick={() => openInGmail(response.draft_id!)}
//                         variant="outline"
//                         size="sm"
//                       >
//                         <Eye className="w-3 h-3 mr-2" />
//                         View in Gmail
//                       </Button>
//                     )}

//                     <Button
//                       onClick={() => handleRegenerateResponse(response)}
//                       disabled={regeneratingId === response.id}
//                       variant="secondary"
//                       size="sm"
//                     >
//                       {regeneratingId === response.id ? (
//                         <>
//                           <Loader2 className="w-3 h-3 mr-2 animate-spin" />
//                           Generating...
//                         </>
//                       ) : (
//                         <>
//                           <Sparkles className="w-3 h-3 mr-2" />
//                           Generate Another Response
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
