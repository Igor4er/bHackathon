import { FC, useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { AddTask } from "../AddTask";
import { Minus, Plus, Pencil, Users, Clock } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { createQuest } from "@/services/api-quest";

interface Block {
  id: string;
  name: string;
}

interface FormDataType {
  name: string;
  description: string;
  maxPlayers: number;
  timeLimit: number;
}

const initialFormData: FormDataType = {
  name: "",
  description: "",
  maxPlayers: 1,
  timeLimit: 30,
};

export const AddQuest: FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([{ id: uuidv4(), name: "" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [tasks, setTasks] = useState<Record<string, any>>({});
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const handleAddBlock = () => {
    setBlocks((prevBlocks) => [...prevBlocks, { id: uuidv4(), name: "" }]);
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== blockId));
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      delete newTasks[blockId];
      return newTasks;
    });
  };

  const handleBlockNameChange = (blockId: string, name: string) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => (block.id === blockId ? { ...block, name } : block))
    );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddTaskClick = (blockId: string) => {
    setActiveBlockId(blockId);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = (taskData: any) => {
    if (activeBlockId) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [activeBlockId]: {
          ...(prevTasks[activeBlockId] || {}),
          ...taskData,
        },
      }));
      setIsModalOpen(false);
      setActiveBlockId(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.name || !formData.maxPlayers || !formData.timeLimit) {
        throw new Error("Please fill in all required fields");
      }

      const questData = {
        name: formData.name,
        desc: formData.description,
        max_players: formData.maxPlayers,
        max_attempts: 3,
        quest_body: blocks.map((block) => ({
          name: block.name,
          allow_changing_answers: true,
          allow_switching_questions: true,
          randomize_questions: true,
          questions: tasks[block.id] || {},
        })),
      };

      const response = await createQuest(questData);
      console.log("Quest created successfully:", response);

      // Clear form data after successful creation
      setFormData(initialFormData);
      setTasks({});
      setBlocks([{ id: uuidv4(), name: "" }]);
    } catch (error) {
      console.error("Error submitting quest:", error);
    }
  };

  return (
    <section className="w-full p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">New Quest ⭐</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="mb-2 ml-1 block">
            Name
          </Label>
          <div className="relative">
            <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <Input
              id="name"
              placeholder="Enter the quest name"
              className="pl-10 text-lg w-full"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="maxPlayers" className="mb-2 ml-1 block">
            Number of people
          </Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <Input
              id="maxPlayers"
              type="number"
              min={1}
              placeholder="Enter the number of people"
              className="pl-10 text-lg w-full"
              value={formData.maxPlayers}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="timeLimit" className="mb-2 ml-1 block">
            Time Limit (minutes)
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <Input
              id="timeLimit"
              type="number"
              min={1}
              placeholder="Enter time (in minutes)"
              className="pl-10 text-lg w-full"
              value={formData.timeLimit}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-xl ml-1 block">Blocks</Label>
          {blocks.map((block) => (
            <Card key={block.id} className="shadow-lg border">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(block.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Minus size={36} />
                  </button>
                  <Input
                    placeholder="Enter block name"
                    className="flex-1"
                    value={block.name}
                    onChange={(e) => handleBlockNameChange(block.id, e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => handleAddTaskClick(block.id)}
                  className="ml-4"
                >
                  Add task <Plus size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleAddBlock}
          className="flex items-center gap-2"
        >
          New Block <Plus size={16} />
        </Button>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="w-[200px] flex items-center justify-center gap-2"
          >
            Add Quest <span className="text-xl">👾</span>
          </Button>
        </div>
      </form>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AddTask onTaskSubmit={handleTaskSubmit} />
      </Dialog>
    </section>
  );
};