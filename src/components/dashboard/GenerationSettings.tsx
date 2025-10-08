import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GenerationSettingsProps {
  count: number;
  difficulty: "basic" | "intermediate" | "advanced";
  onCountChange: (count: number) => void;
  onDifficultyChange: (difficulty: "basic" | "intermediate" | "advanced") => void;
}

export function GenerationSettings({
  count,
  difficulty,
  onCountChange,
  onDifficultyChange,
}: GenerationSettingsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Number of Cards</Label>
        <Select value={count.toString()} onValueChange={(val) => onCountChange(Number(val))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 cards</SelectItem>
            <SelectItem value="10">10 cards</SelectItem>
            <SelectItem value="15">15 cards</SelectItem>
            <SelectItem value="20">20 cards</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Difficulty Level</Label>
        <Select value={difficulty} onValueChange={(val: any) => onDifficultyChange(val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
