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
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">RSVP</h2>
          <div className="bg-red-900/30 border border-red-500 rounded-2xl p-8 max-w-md mx-auto">
            <UserX className="text-red-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2 text-red-400">RSVP Closed</h3>
            <p className={`text-${currentTheme.textSecondary}`}>
              The RSVP deadline has passed. Please contact us directly if you need to make changes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Heart className={`text-${currentTheme.accent} mr-3`} size={32} />
          <h2 className="text-4xl font-bold">RSVP</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-lg max-w-md mx-auto`}>
          Please confirm your attendance by December 10, 2025
        </p>
      </div>

      <Card className={`max-w-2xl mx-auto bg-${currentTheme.card} border-${currentTheme.border} shadow-2xl`}>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Will you be joining us?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+62 xxx xxxx xxxx"
                className="mt-1"
              />
            </div>

            {/* Attendance Selection */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">
                Will you be attending? *
              </Label>
              <RadioGroup 
                value={formData.attendance} 
                onValueChange={handleAttendanceChange}
                className="space-y-3"
              >
                {attendanceOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label 
                        htmlFor={option.value} 
                        className="flex items-center cursor-pointer flex-1 p-3 rounded-lg border border-gray-700 hover:bg-gray-800/50 transition-all duration-200"
                      >
                        <Icon size={20} className={`mr-3 text-${option.color}-400`} />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className={`text-sm text-${currentTheme.textSecondary}`}>
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
                <Label htmlFor="guestCount">Number of Guests (including yourself)</Label>
                <Input
                  id="guestCount"
                  name="guestCount"
                  type="number"
                  min="1"
                  max="4"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className="mt-1 w-32"
                />
                <p className={`text-sm text-${currentTheme.textSecondary} mt-1`}>
                  Maximum 4 guests per invitation
                </p>
              </div>
            )}

            {/* Dietary Restrictions - only show if attending */}
            {formData.attendance === "attending" && (
              <div>
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions or Allergies</Label>
                <Input
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  placeholder="e.g., Vegetarian, Halal, Allergic to nuts"
                  className="mt-1"
                />
              </div>
            )}

            {/* Message */}
            <div>
              <Label htmlFor="message">Special Message for the Couple</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Share your wishes, memories, or anything you'd like to tell us..."
                rows={4}
                className="mt-1"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!formData.name || !formData.email || !formData.attendance || isSubmitting}
              className={`w-full bg-gradient-to-r ${currentTheme.secondary} hover:opacity-90 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send size={20} className="mr-2" />
                  Send RSVP
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RSVP Stats Preview */}
      <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl p-6 border border-${currentTheme.border} shadow-xl max-w-md mx-auto mt-8`}>
        <h3 className="text-lg font-semibold mb-4 text-center">Current RSVPs</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {mockRSVPData.rsvps.filter(r => r.attendance === 'attending').length}
            </div>
            <div className={`text-sm text-${currentTheme.textSecondary}`}>Attending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">
              {mockRSVPData.rsvps.filter(r => r.attendance === 'maybe').length}
            </div>
            <div className={`text-sm text-${currentTheme.textSecondary}`}>Maybe</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {mockRSVPData.rsvps.filter(r => r.attendance === 'not-attending').length}
            </div>
            <div className={`text-sm text-${currentTheme.textSecondary}`}>Declining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVPForm;