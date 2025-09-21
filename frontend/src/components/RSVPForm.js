import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";
import { Send, Heart, UserCheck, UserX, Clock } from "lucide-react";
import { mockRSVPData } from "../utils/mockData";

import Analytics from "../analytics";
const RSVPForm = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attendance: "",
    guestCount: "1",
    dietaryRestrictions: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttendanceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      attendance: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add to mock data
      const newRSVP = {
        id: Date.now(),
        ...formData,
        submittedAt: new Date().toISOString()
      };
      mockRSVPData.rsvps.push(newRSVP);

      // Track RSVP submit (exclude PII)
      Analytics.track("rsvp_submit", {
        attendance: formData.attendance || undefined,
        guest_count: parseInt(formData.guestCount, 10) || 1,
        has_message: Boolean(formData.message && formData.message.trim().length),
      });

      toast({
        title: "RSVP Submitted Successfully! 💕",
        description: "Thank you for confirming your attendance. We can't wait to celebrate with you!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        attendance: "",
        guestCount: "1",
        dietaryRestrictions: "",
        message: ""
      });
    } catch (error) {
      // Track error without PII
      Analytics.track("rsvp_error", {
        attendance: formData.attendance || undefined,
        guest_count: parseInt(formData.guestCount, 10) || 1,
        reason: "submit_failed",
      });

      toast({
        title: "Submission Failed",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const attendanceOptions = [
    {
      value: "attending",
      label: "Joyfully Accepting",
      description: "Can't wait to celebrate with you!",
      icon: UserCheck,
      color: "green"
    },
    {
      value: "not-attending",
      label: "Regretfully Declining",
      description: "Will be there in spirit",
      icon: UserX,
      color: "red"
    },
    {
      value: "maybe",
      label: "Tentatively Accepting",
      description: "Will confirm closer to the date",
      icon: Clock,
      color: "amber"
    }
  ];

  const rsvpDeadline = new Date("2025-12-10T23:59:59");
  const isRSVPOpen = new Date() <= rsvpDeadline;

  if (!isRSVPOpen) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">RSVP</h2>
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 max-w-sm mx-auto">
            <UserX className="text-red-400 mx-auto mb-3" size={32} />
            <h3 className="text-lg font-semibold mb-2 text-red-400">RSVP Closed</h3>
            <p className={`text-${currentTheme.textSecondary} text-sm`}>
              The RSVP deadline has passed. Please contact us directly if you need to make changes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-3">
          <Heart className={`text-${currentTheme.accent} mr-2`} size={24} />
          <h2 className="text-2xl font-bold">RSVP</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-sm max-w-xs mx-auto`}>
          Please confirm your attendance by December 10, 2025
        </p>
      </div>

      <Card className={`max-w-sm mx-auto bg-${currentTheme.card} border-${currentTheme.border} shadow-xl`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-lg">
            Will you be joining us?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+62 xxx xxxx xxxx"
                  className="mt-1 text-sm"
                />
              </div>
            </div>

            {/* Attendance Selection */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Will you be attending? *
              </Label>
              <RadioGroup 
                value={formData.attendance} 
                onValueChange={handleAttendanceChange}
                className="space-y-2"
              >
                {attendanceOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} className="shrink-0" />
                      <Label 
                        htmlFor={option.value} 
                        className="flex items-center cursor-pointer flex-1 p-2 rounded-lg border border-gray-700/30 hover:bg-gray-800/30 transition-all duration-200 text-sm"
                      >
                        <Icon size={16} className={`mr-2 text-${option.color}-400 shrink-0`} />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{option.label}</div>
                          <div className={`text-xs text-${currentTheme.textSecondary} truncate`}>
                            {option.description}
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Guest Count - only show if attending */}
            {formData.attendance === "attending" && (
              <div>
                <Label htmlFor="guestCount" className="text-sm">Number of Guests (including yourself)</Label>
                <Input
                  id="guestCount"
                  name="guestCount"
                  type="number"
                  min="1"
                  max="4"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className="mt-1 w-20 text-sm"
                />
                <p className={`text-xs text-${currentTheme.textSecondary} mt-1`}>
                  Maximum 4 guests per invitation
                </p>
              </div>
            )}

            {/* Dietary Restrictions - only show if attending */}
            {formData.attendance === "attending" && (
              <div>
                <Label htmlFor="dietaryRestrictions" className="text-sm">Dietary Restrictions</Label>
                <Input
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  placeholder="e.g., Vegetarian, Halal"
                  className="mt-1 text-sm"
                />
              </div>
            )}

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-sm">Message for the Couple</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Share your wishes..."
                rows={3}
                className="mt-1 text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!formData.name || !formData.email || !formData.attendance || isSubmitting}
              className={`w-full bg-gradient-to-r ${currentTheme.secondary} hover:opacity-90 text-white font-semibold py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send size={16} className="mr-2" />
                  Send RSVP
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RSVP Stats Preview */}
      <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-xl p-4 border border-${currentTheme.border} shadow-lg max-w-xs mx-auto mt-6`}>
        <h3 className="text-sm font-semibold mb-3 text-center">Current RSVPs</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">
              {mockRSVPData.rsvps.filter(r => r.attendance === 'attending').length}
            </div>
            <div className={`text-xs text-${currentTheme.textSecondary}`}>Attending</div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-400">
              {mockRSVPData.rsvps.filter(r => r.attendance === 'maybe').length}
            </div>
            <div className={`text-xs text-${currentTheme.textSecondary}`}>Maybe</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-400">
              {mockRSVPData.rsvps.filter(r => r.attendance === 'not-attending').length}
            </div>
            <div className={`text-xs text-${currentTheme.textSecondary}`}>Declining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVPForm;