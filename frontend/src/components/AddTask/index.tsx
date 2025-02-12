import { FC, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash, NotebookPen, Save, Upload } from "lucide-react";

interface AddTaskProps {
  onTaskSubmit: (taskData: any) => void;
}

export const AddTask: FC<AddTaskProps> = ({ onTaskSubmit }) => {
  const [taskInput, setTaskInput] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [options, setOptions] = useState(["Option 1", "Option 2"]);
  const [files, setFiles] = useState<{ [key: number]: File }>({});
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [correctOptions, setCorrectOptions] = useState<number[]>([]);
  const [extendedAnswer, setExtendedAnswer] = useState("");

  const handleAddTask = () => {
    const questionId = uuidv4();
    let formattedOptions:
      | Array<{ text: string; is_correct: boolean }>
      | undefined;

    if (selectedType === "one") {
      formattedOptions = options.map((text, idx) => ({
        text,
        is_correct: idx === correctOption,
      }));
    } else if (selectedType === "several") {
      formattedOptions = options.map((text, idx) => ({
        text,
        is_correct: correctOptions.includes(idx),
      }));
    }

    const formattedTask = {
      [questionId]: {
        descr: taskInput,
        type: selectedType !== "extended" ? "choose" : "extended",
        options: selectedType !== "extended" ? formattedOptions : undefined,
        answer: selectedType === "extended" ? extendedAnswer : undefined,
        files: files,
        questionFile: questionFile,
      },
    };

    onTaskSubmit(formattedTask);

    setTaskInput("");
    setSelectedType("");
    setOptions(["Option 1", "Option 2"]);
    setFiles({});
    setQuestionFile(null);
    setCorrectOption(null);
    setCorrectOptions([]);
    setExtendedAnswer("");
  };

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (selectedType === "several") {
      setCorrectOptions(correctOptions.filter((i) => i !== index));
    } else if (selectedType === "one" && correctOption === index) {
      setCorrectOption(null);
    }
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles((prevFiles) => ({ ...prevFiles, [index]: file }));
    }
  };

  const handleQuestionFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setQuestionFile(file);
    }
  };

  const toggleCorrectOption = (index: number) => {
    if (correctOptions.includes(index)) {
      setCorrectOptions(correctOptions.filter((i) => i !== index));
    } else {
      setCorrectOptions([...correctOptions, index]);
    }
  };

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2">New Task ✨</DialogTitle>
        </DialogHeader>

        <div>
          <div className="mb-2">
            <Label htmlFor="taskName" className="block mb-2 ml-1">
              Question
            </Label>
            <div className="relative">
              <NotebookPen
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <Input
                id="taskName"
                placeholder="Enter the question"
                type="text"
                className="w-full pl-10 text-[20px]"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                required
              />
            </div>
            <input
              type="file"
              onChange={handleQuestionFileChange}
              className="hidden"
              id="question-file-upload"
            />
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                const fileInput = document.getElementById(
                  "question-file-upload"
                ) as HTMLInputElement;
                if (fileInput) {
                  fileInput.click();
                }
              }}
            >
              <Upload className="w-4 h-4 mr-2" /> Upload file
            </Button>
          </div>

          <div className="mb-4 w-[200px]">
            <Select onValueChange={setSelectedType} value={selectedType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one">One option</SelectItem>
                <SelectItem value="several">Several options</SelectItem>
                <SelectItem value="extended">Extended answer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedType === "one" && (
            <div className="mb-4">
              <Label className="block mb-2 ml-1">Options</Label>
              <div className="mb-2 ml-1 text-sm text-gray-600">
                Choose the correct option.
              </div>
              <RadioGroup onValueChange={(val) => setCorrectOption(Number(val))}>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="w-full"
                    />
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(index, e)}
                      className="hidden"
                      id={`file-upload-${index}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const fileInput = document.getElementById(
                          `file-upload-${index}`
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.click();
                      }}
                    >
                      <Save className="text-gray-500" size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
              <Button variant="outline" className="mt-2" onClick={addOption}>
                <Plus className="w-4 h-4 mr-2" /> Add Option
              </Button>
            </div>
          )}

          {selectedType === "several" && (
            <div className="mb-4">
              <Label className="block mb-2 ml-1">Options</Label>
              <div className="mb-2 ml-1 text-sm text-gray-600">
                Select all correct options.
              </div>
              <div>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Checkbox
                      id={`checkbox-${index}`}
                      onChange={() => toggleCorrectOption(index)}
                      checked={correctOptions.includes(index)}
                    />
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="w-full"
                    />
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(index, e)}
                      className="hidden"
                      id={`file-upload-${index}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const fileInput = document.getElementById(
                          `file-upload-${index}`
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.click();
                      }}
                    >
                      <Save className="text-gray-500" size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-2" onClick={addOption}>
                <Plus className="w-4 h-4 mr-2" /> Add Option
              </Button>
            </div>
          )}

          {selectedType === "extended" && (
            <div className="mb-4">
              <Label className="block mb-2 ml-1">Answer</Label>
              <Textarea
                placeholder="Enter the correct answer"
                className="w-full mb-4"
                value={extendedAnswer}
                onChange={(e) => setExtendedAnswer(e.target.value)}
              />
              <div className="mt-2 flex items-center gap-2">
                <Checkbox id="ai-verify" />
                <Label htmlFor="ai-verify">
                  Verify user response using AI
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedType && (
              <Button type="button" onClick={handleAddTask}>
                Add <span className="text-xl">🧩</span>
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </>
  );
};