import {
    Select,
    SelectLabel,
    SelectGroup,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface SelectComponentProps {
    onValueChange: (value: string) => void;
    placeholder: string;
    label: string;
    items: { title: string }[];
}

export const TransformSelect: React.FC<SelectComponentProps> = ({ onValueChange, placeholder, label, items }) => (
    <div style={{ flex: '1 1 50%', padding: '3px' }}>
        <Select onValueChange={(e) => onValueChange(e)}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {items.map((item, index) => (
                        <SelectItem key={index} value={item.title}>{item.title}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
);