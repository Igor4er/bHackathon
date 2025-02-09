import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

export const AddTask = () => {
  const [selectedType, setSelectedType] = useState("");
  const [options, setOptions] = useState(["Option 1", "Option 2"]);
  const [files, setFiles] = useState({});
  const [questionFile, setQuestionFile] = useState<File | null>(null);

  console.log(files);
  console.log(questionFile);

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

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2">New Task ✨</DialogTitle>
        </DialogHeader>

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
          <Select onValueChange={setSelectedType}>
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
            <DialogDescription className="block mb-2 ml-1">
              The option you choose is the correct option
            </DialogDescription>
            <RadioGroup>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
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
                      if (fileInput) {
                        fileInput.click();
                      }
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
            <DialogDescription className="block mb-2 ml-1">
              The options you select are the correct options
            </DialogDescription>
            <div>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Checkbox id={`checkbox-${index}`} />
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
                      if (fileInput) {
                        fileInput.click();
                      }
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
            />
            <div className="mt-2 flex items-center gap-2">
              <Checkbox id="ai-verify" />
              <Label htmlFor="ai-verify">Verify user response using AI</Label>
            </div>
          </div>
        )}

        <DialogFooter>
          {selectedType && (
            <Button type="submit">
              Add <span className="text-xl">🧩</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </>
  );
};
