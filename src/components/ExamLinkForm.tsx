
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Lock, Clock } from 'lucide-react';
import { calculateExpiryFromNow } from '@/lib/linkGenerator';

interface ExamFormProps {
  onGenerateLink: (settings: ExamSettings) => void;
}

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

const ExamLinkForm: React.FC<ExamFormProps> = ({ onGenerateLink }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [requirePassword, setRequirePassword] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(60);
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('minutes');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [limitAttempts, setLimitAttempts] = useState<boolean>(false);
  const [maxAttempts, setMaxAttempts] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settings: ExamSettings = {
      title,
      description,
      password: requirePassword ? password : undefined,
      duration,
      durationUnit,
      startDate,
      limitAttempts,
      maxAttempts: limitAttempts ? maxAttempts : undefined
    };
    
    onGenerateLink(settings);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Exam Link</CardTitle>
        <CardDescription>Configure the settings for your exam link</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Exam Title *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Midterm Exam"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Enter exam instructions or details"
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="duration">Duration</Label>
              <div className="flex gap-2">
                <Input 
                  id="duration" 
                  type="number" 
                  min={1} 
                  value={duration} 
                  onChange={(e) => setDuration(Number(e.target.value))} 
                  className="flex-1"
                  required
                />
                <Select 
                  value={durationUnit} 
                  onValueChange={(value: 'minutes' | 'hours') => setDurationUnit(value)}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex-1 space-y-1.5">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="require-password" 
              checked={requirePassword} 
              onCheckedChange={setRequirePassword} 
            />
            <Label htmlFor="require-password" className="cursor-pointer">Require Password</Label>
          </div>
          
          {requirePassword && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="text" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pl-8"
                  placeholder="Enter secure password"
                  required={requirePassword}
                />
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="limit-attempts" 
              checked={limitAttempts} 
              onCheckedChange={setLimitAttempts} 
            />
            <Label htmlFor="limit-attempts" className="cursor-pointer">Limit Attempts</Label>
          </div>
          
          {limitAttempts && (
            <div className="space-y-1.5">
              <Label htmlFor="max-attempts">Maximum Attempts</Label>
              <Input 
                id="max-attempts" 
                type="number" 
                min={1} 
                value={maxAttempts} 
                onChange={(e) => setMaxAttempts(Number(e.target.value))} 
                required={limitAttempts}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Generate Exam Link
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExamLinkForm;
