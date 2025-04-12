
import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'MCQ';
  options?: QuestionOption[];
  answer?: string;
  instruction?: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onUpdate: (updatedQuestion: Partial<Question>) => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onMoveUp,
  onMoveDown,
  onRemove,
  onUpdate,
  isFirst,
  isLast
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState<Question>({ ...question });

  const handleSaveEdit = () => {
    onUpdate(editedQuestion);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedQuestion({ ...question });
    setIsEditing(false);
  };

  const handleOptionChange = (optionIndex: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    if (!editedQuestion.options) return;
    
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value
    };
    
    setEditedQuestion({
      ...editedQuestion,
      options: updatedOptions
    });
  };

  const handleAddOption = () => {
    if (!editedQuestion.options) {
      setEditedQuestion({
        ...editedQuestion,
        options: []
      });
    }
    
    const newOption: QuestionOption = {
      id: `option-${Date.now()}`,
      text: '',
      isCorrect: false
    };
    
    setEditedQuestion({
      ...editedQuestion,
      options: [...(editedQuestion.options || []), newOption]
    });
  };

  const handleRemoveOption = (optionIndex: number) => {
    if (!editedQuestion.options) return;
    
    const updatedOptions = editedQuestion.options.filter((_, i) => i !== optionIndex);
    
    setEditedQuestion({
      ...editedQuestion,
      options: updatedOptions
    });
  };

  const renderQuestionContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor={`question-${index}-text`}>Question Text</Label>
            <Textarea
              id={`question-${index}-text`}
              value={editedQuestion.text}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, text: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor={`question-${index}-type`}>Question Type</Label>
            <select
              id={`question-${index}-type`}
              value={editedQuestion.type}
              onChange={(e) => setEditedQuestion({ 
                ...editedQuestion, 
                type: e.target.value as Question['type']
              })}
              className="mt-1 w-full rounded-md border border-input p-2"
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="multiple-choice">Multiple Choice (Alt)</option>
              <option value="short-answer">Short Answer</option>
              <option value="essay">Essay</option>
            </select>
          </div>
          
          {(editedQuestion.type === 'MCQ' || editedQuestion.type === 'multiple-choice') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddOption}
                >
                  Add Option
                </Button>
              </div>
              
              {editedQuestion.options && editedQuestion.options.map((option, optionIndex) => (
                <div key={option.id || optionIndex} className="flex items-start gap-3 p-3 border rounded-md">
                  <Checkbox
                    id={`option-${index}-${optionIndex}-correct`}
                    checked={option.isCorrect}
                    onCheckedChange={(checked) => 
                      handleOptionChange(optionIndex, 'isCorrect', checked === true)
                    }
                    className="mt-2"
                  />
                  <div className="flex-grow">
                    <Label htmlFor={`option-${index}-${optionIndex}-text`}>Option Text</Label>
                    <Input
                      id={`option-${index}-${optionIndex}-text`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(optionIndex, 'text', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(optionIndex)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              
              {(!editedQuestion.options || editedQuestion.options.length === 0) && (
                <div className="text-center p-3 border rounded-md border-dashed">
                  <p className="text-gray-500">No options added. Click "Add Option" to create options.</p>
                </div>
              )}
            </div>
          )}
          
          {(editedQuestion.type === 'short-answer' || editedQuestion.type === 'essay') && (
            <div>
              <Label htmlFor={`question-${index}-answer`}>Correct Answer</Label>
              <Textarea
                id={`question-${index}-answer`}
                value={editedQuestion.answer || ''}
                onChange={(e) => setEditedQuestion({ ...editedQuestion, answer: e.target.value })}
                className="mt-1"
                placeholder={editedQuestion.type === 'essay' ? 'Enter model answer or grading rubric' : 'Enter correct answer'}
              />
            </div>
          )}
          
          <div>
            <Label htmlFor={`question-${index}-instruction`}>Instructions (Optional)</Label>
            <Input
              id={`question-${index}-instruction`}
              value={editedQuestion.instruction || ''}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, instruction: e.target.value })}
              className="mt-1"
              placeholder="Instructions for students"
            />
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <div className="flex gap-2 items-start mb-4">
          <div className="bg-orange-100 text-orange-800 font-medium px-2 py-1 rounded text-sm">
            Question {index + 1}
          </div>
          <div className="bg-gray-100 text-gray-700 font-medium px-2 py-1 rounded text-sm">
            {question.type === 'MCQ' ? 'Multiple Choice' : 
             question.type === 'short-answer' ? 'Short Answer' : 
             question.type === 'essay' ? 'Essay' : question.type}
          </div>
        </div>
        
        <div className="text-lg font-medium mb-3">{question.text}</div>
        
        {question.instruction && (
          <div className="text-gray-600 italic mb-4">
            <span className="font-medium">Instructions:</span> {question.instruction}
          </div>
        )}
        
        {(question.type === 'MCQ' || question.type === 'multiple-choice') && question.options && (
          <div className="space-y-2 mb-4">
            {question.options.map((option, i) => (
              <div key={option.id || i} className="flex items-start gap-3 p-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  option.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <div className={option.isCorrect ? 'font-medium text-green-700' : ''}>
                  {option.text}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {(question.type === 'short-answer' || question.type === 'essay') && question.answer && (
          <div className="bg-gray-50 p-3 rounded-md border mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</div>
            <div className="text-gray-800">{question.answer}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        {renderQuestionContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            className={isFirst ? 'text-gray-400' : 'text-gray-700'}
          >
            <ArrowUp size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            className={isLast ? 'text-gray-400' : 'text-gray-700'}
          >
            <ArrowDown size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        </div>
        
        <div>
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="mr-2"
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveEdit}
              >
                <Save size={16} className="mr-1" />
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
