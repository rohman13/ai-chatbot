"use client";

import axios from "axios";
import { motion } from "framer-motion";
import * as React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function AgentsSelect() {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [agentName, setAgentName] = useState<string>("");
  const [functions, setFunctions] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [active, setActive] = useState<string>("1");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("/api/agents");
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleSetAgent = () => {
    if (selectedAgent) {
      console.log("Selected Agent:", selectedAgent);
      // Add your logic to handle the selected agent
    }
  };

  const handleSubmit = async () => {
    try {
      const agentData = {
        id: selectedAgent?.id || null,
        name: agentName,
        functions,
        systemPrompt,
        active: active,
      };

      await axios.put("/api/agents", agentData);
      console.log("Agent updated successfully");
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center gap-2 w-full">
        <Select onValueChange={(value) => setSelectedAgent(agents.find(agent => agent.id === value))}>
          <SelectTrigger className="flex-1 w-full">
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleSetAgent} variant="secondary">
          Set Agent
        </Button>
      </div>

      <Input
        placeholder="Agent Name"
        value={agentName}
        onChange={(e) => setAgentName(e.target.value)}
      />
      <Input
        placeholder="Functions"
        value={functions}
        onChange={(e) => setFunctions(e.target.value)}
      />
      <Textarea
        placeholder="System Prompt"
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
      />
      <Select onValueChange={setActive}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Active" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="1">Y</SelectItem>
            <SelectItem value="0">N</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit} variant="default">
        Submit
      </Button>
    </motion.div>
  );
}