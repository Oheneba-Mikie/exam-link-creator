
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { generateExamLink, formatExpiryTime, calculateExpiryFromNow } from "@/lib/linkGenerator";

// Export the ExamSettings interface so it can be imported by other components
export interface ExamSettings {
  title: string;
  description?: string;
  password?: string;
  duration: number;
  durationUnit: 'minutes' | 'hours';
  startDate: Date;
  limitAttempts: boolean;
  maxAttempts?: number;
}

interface ExamLinkFormProps {
  examId?: string;
  examTitle?: string;
  onLinkGenerated: (link: string) => void;
  onGenerateLink?: (settings: ExamSettings) => void; // Added for backward compatibility
}

const ExamLinkForm: React.FC<ExamLinkFormProps> = ({ 
  examId, 
  examTitle = "Untitled Exam", 
  onLinkGenerated,
  onGenerateLink
}) => {
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [limitAttempts, setLimitAttempts] = useState(false);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [setExpiryDate, setSetExpiryDate] = useState(true);
  const [duration, setDuration] = useState(60);
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('minutes');
  const [date, setDate] = useState<Date>(new Date());
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  
  const calculateExpiry = () => {
    if (!setExpiryDate) return null;
    
    if (customDate) {
      return customDate;
    }
    
    return calculateExpiryFromNow(duration, durationUnit);
  };
  
  const handleGenerateLink = () => {
    const settings: ExamSettings = {
      title: examTitle,
      password: requirePassword ? password : undefined,
      duration,
      durationUnit,
      startDate: new Date(),
      limitAttempts,
      maxAttempts: limitAttempts ? maxAttempts : undefined
    };
    
    const link = generateExamLink(settings);
    
    // Support both callback patterns
    if (onGenerateLink) {
      onGenerateLink(settings);
    }
    
    onLinkGenerated(link);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Exam Link Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="require-password">Require password</Label>
            <Switch 
              id="require-password" 
              checked={requirePassword}
              onCheckedChange={setRequirePassword}
            />
          </div>
          {requirePassword && (
            <div className="pt-2">
              <Label htmlFor="password">Exam password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Set a password..."
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="set-expiry">Set expiry date</Label>
            <Switch 
              id="set-expiry" 
              checked={setExpiryDate}
              onCheckedChange={setSetExpiryDate}
            />
          </div>
          {setExpiryDate && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="col-span-1">
                <Label htmlFor="duration">Duration</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  min={1}
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value) || 60)}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="duration-unit">Unit</Label>
                <select 
                  id="duration-unit" 
                  className="w-full h-10 px-3 border border-gray-300 rounded-md"
                  value={durationUnit}
                  onChange={e => setDurationUnit(e.target.value as 'minutes' | 'hours')}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
              <div className="col-span-1">
                <Label>Expires at</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDate ? (
                        format(customDate, 'PPP')
                      ) : (
                        formatExpiryTime(calculateExpiryFromNow(duration, durationUnit))
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customDate || date}
                      onSelect={date => {
                        if (date) {
                          setCustomDate(date);
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Label className="text-xs text-gray-500">
                        Select a custom date
                      </Label>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="limit-attempts">Limit attempts</Label>
            <Switch 
              id="limit-attempts" 
              checked={limitAttempts}
              onCheckedChange={setLimitAttempts}
            />
          </div>
          {limitAttempts && (
            <div className="pt-2">
              <Label htmlFor="max-attempts">Maximum attempts</Label>
              <Input 
                id="max-attempts" 
                type="number" 
                min={1}
                value={maxAttempts}
                onChange={e => setMaxAttempts(parseInt(e.target.value) || 1)}
              />
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleGenerateLink} 
          className="w-full mt-4"
        >
          Generate Exam Link
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExamLinkForm;
