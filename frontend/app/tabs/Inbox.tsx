"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Mail, Clock, User, Bot, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/frontend/lib/api";
interface Email {
  id: string;
  thread_id: string;
  subject: string;
  sender: string;
  body: string;
  date_received: string;
  labelIds: string[];
}

interface InboxTabProps {
  userEmail: string;
}

export default function InboxTab({ userEmail }: InboxTabProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingEmail, setProcessingEmail] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userEmail) {
      fetchInbox();
    }
  }, [userEmail]);
  const fetchInbox = async () => {
    if (!userEmail) return;

    setIsLoading(true);
    try {
      const data = await apiClient.getInbox(userEmail);
      setEmails(data.emails || []);
    } catch (error) {
      console.error("Failed to fetch inbox:", error);
      toast({
        title: "Error",
        description: "Failed to fetch inbox. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleGenerateAIResponse = async (email: Email) => {
    setProcessingEmail(email.id);
    try {
      const data = await apiClient.generateAIResponse({
        user_email: userEmail,
        email_id: email.id,
        thread_id: email.thread_id,
        email_content: email.body,
      });

      toast({
        title: "AI Response Generated",
        description: "Check the Tasks tab to view and send the response.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingEmail(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const isUnread = (labelIds: string[] = []) => {
    return labelIds.includes("UNREAD");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-500">Loading inbox...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Inbox ({emails.length})
        </CardTitle>
        <Button variant="outline" size="sm" onClick={fetchInbox}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {emails.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No emails found</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                    isUnread(email.labelIds) ? "bg-blue-50 border-blue-200" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3
                        className={`font-medium text-gray-900 mb-1 ${
                          isUnread(email.labelIds) ? "font-bold" : ""
                        }`}
                      >
                        {email.subject || "(No Subject)"}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <User className="w-3 h-3 mr-1" />
                        From: {email.sender}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {isUnread(email.labelIds) && <Badge>Unread</Badge>}
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(email.date_received)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                    {email.body}
                  </p>
                  <Button
                    onClick={() => handleGenerateAIResponse(email)}
                    disabled={processingEmail === email.id}
                    size="sm"
                    className="w-full"
                  >
                    {processingEmail === email.id ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 mr-2" />
                        Generate AI Response
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
