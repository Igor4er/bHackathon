import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Minus, Plus, Pencil, Users, Clock } from "lucide-react";

export const AddQuest: FC = () => {
  const [blocks, setBlocks] = useState([{ id: 1 }]);

  const handleAddBlock = () => {
    setBlocks([...blocks, { id: blocks.length + 1 }]);
  };

  return (
    <section className="w-full pt-6 pl-10 pr-10 pb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Quest ⭐</h1>
      </div>

      <form>
        <div className="mb-6">
          <Label htmlFor="questName" className="block mb-2 ml-1">
            Name
          </Label>
          <div className="relative">
            <Pencil
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <Input
              id="questName"
              placeholder="Enter the quest name"
              className="w-full pl-10 text-[20px]"
            />
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="peopleCount" className="block mb-2 ml-1">
            Number of people
          </Label>
          <div className="relative">
            <Users
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <Input
              id="peopleCount"
              placeholder="Enter the number of people"
              type="number"
              className="w-full pl-10 text-[20px]"
            />
          </div>
        </div>

        <div className="mb-8">
          <Label htmlFor="time" className="block mb-2 ml-1">
            Time
          </Label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <Input
              id="time"
              placeholder="Enter time (in minutes)"
              type="number"
              className="w-full pl-10 text-[20px]"
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="space-y-4">
            <Label htmlFor="time" className="block text-xl ml-1">
              Blocks
            </Label>
            {blocks.map((block) => (
              <Card
                key={block.id}
                className="w-full shadow-lg border p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Minus size={36} className="text-gray-400 mr-2" />
                  <Input placeholder="Enter block name" className="w-[500px]" />
                </div>
                <CardContent className="p-0">
                  <Button variant="default">
                    Add task <Plus size={16} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button
          className="flex items-center gap-2 bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 mb-10"
          variant="default"
          type="button"
          onClick={handleAddBlock}
        >
          New Block
          <Plus size={16} />
        </Button>

        <div className="flex justify-end">
          <Button
            className="flex items-center gap-2 w-[200px]"
            variant="default"
          >
            Add Quest <span className="text-xl">👾</span>
          </Button>
        </div>
      </form>
    </section>
  );
};
